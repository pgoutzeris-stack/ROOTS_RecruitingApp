-- ROOTS Recruiting – Supabase Schema (Schema: recruiting)
-- Bereits angewendet via Migration: recruiting_applicants_and_documents

-- interviews: Interview-Sessions (Erst + Zweit als JSONB)
-- applicants: Bewerber-Stammdaten (first_name, middle_name, last_name, full_name)
-- applicant_documents: CVs und weitere Dokumente (Storage: recruiting-documents)

-- Zugriff im Frontend:
--   sb.schema('recruiting').from('interviews')
--   sb.schema('recruiting').from('applicants')
--   sb.schema('recruiting').from('applicant_documents')
