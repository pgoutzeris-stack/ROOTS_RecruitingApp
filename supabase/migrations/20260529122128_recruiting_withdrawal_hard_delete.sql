create or replace function recruiting_private.delete_applicant_withdrawal(p_applicant_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, storage, recruiting, recruiting_private
as $$
declare
  v_session_id text;
  v_doc_paths text[] := array[]::text[];
  v_applicant_deleted integer := 0;
  v_interviews_deleted integer := 0;
  v_docs_deleted integer := 0;
  v_storage_deleted integer := 0;
  v_notifications_deleted integer := 0;
  v_bulletin_deleted integer := 0;
  v_applicant_backups_deleted integer := 0;
  v_interview_backups_deleted integer := 0;
begin
  if auth.uid() is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;

  select a.session_id
    into v_session_id
    from recruiting.applicants a
   where a.id = p_applicant_id;

  if not found then
    return jsonb_build_object('ok', true, 'not_found', true, 'applicant_id', p_applicant_id);
  end if;

  select coalesce(array_agg(d.storage_path) filter (where d.storage_path is not null and d.storage_path <> ''), array[]::text[])
    into v_doc_paths
    from recruiting.applicant_documents d
   where d.applicant_id = p_applicant_id;

  delete from recruiting.applicant_documents d
   where d.applicant_id = p_applicant_id;
  get diagnostics v_docs_deleted = row_count;

  if cardinality(v_doc_paths) > 0 then
    delete from storage.objects o
     where o.bucket_id = 'recruiting-documents'
       and o.name = any(v_doc_paths);
    get diagnostics v_storage_deleted = row_count;
  end if;

  if v_session_id is not null and v_session_id <> '' then
    delete from recruiting.notifications n
     where n.session_id = v_session_id;
    get diagnostics v_notifications_deleted = row_count;

    delete from recruiting.bulletin_posts b
     where b.session_id = v_session_id;
    get diagnostics v_bulletin_deleted = row_count;

    delete from recruiting.interviews i
     where i.session_id = v_session_id;
    get diagnostics v_interviews_deleted = row_count;
  end if;

  delete from recruiting.applicants a
   where a.id = p_applicant_id;
  get diagnostics v_applicant_deleted = row_count;

  delete from recruiting_private.interview_backups ib
   where ib.session_id = v_session_id;
  get diagnostics v_interview_backups_deleted = row_count;

  delete from recruiting_private.applicant_backups ab
   where ab.source_applicant_id = p_applicant_id
      or ab.session_id = v_session_id;
  get diagnostics v_applicant_backups_deleted = row_count;

  return jsonb_build_object(
    'ok', true,
    'applicant_id', p_applicant_id,
    'session_id', v_session_id,
    'deleted', jsonb_build_object(
      'applicants', v_applicant_deleted,
      'interviews', v_interviews_deleted,
      'applicant_documents', v_docs_deleted,
      'storage_objects', v_storage_deleted,
      'notifications', v_notifications_deleted,
      'bulletin_posts', v_bulletin_deleted,
      'applicant_backups', v_applicant_backups_deleted,
      'interview_backups', v_interview_backups_deleted
    )
  );
end;
$$;

revoke all on function recruiting_private.delete_applicant_withdrawal(uuid) from public;
grant usage on schema recruiting_private to authenticated;
grant execute on function recruiting_private.delete_applicant_withdrawal(uuid) to authenticated;

create or replace function recruiting.delete_applicant_withdrawal(p_applicant_id uuid)
returns jsonb
language sql
security invoker
set search_path = pg_catalog, recruiting_private
as $$
  select recruiting_private.delete_applicant_withdrawal(p_applicant_id);
$$;

revoke all on function recruiting.delete_applicant_withdrawal(uuid) from public;
grant execute on function recruiting.delete_applicant_withdrawal(uuid) to authenticated;
