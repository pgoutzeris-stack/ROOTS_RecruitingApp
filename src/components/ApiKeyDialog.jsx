import { memo, useState, useCallback } from 'react';
import { theme, shared } from '../theme';
import { getAiConfig, setAiConfig } from '../utils/ai';

const MODELS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (empfohlen, g\u00FCnstig)' },
  { value: 'gpt-4o', label: 'GPT-4o (h\u00F6here Qualit\u00E4t)' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (am g\u00FCnstigsten)' },
];

const loadInitial = () => {
  const config = getAiConfig();
  return { apiKey: config.apiKey || '', model: config.model || 'gpt-4o-mini' };
};

const ApiKeyDialog = memo(({ onClose }) => {
  const [apiKey, setApiKey] = useState(() => loadInitial().apiKey);
  const [model, setModel] = useState(() => loadInitial().model);

  const handleSave = useCallback(() => {
    setAiConfig({ apiKey: apiKey.trim(), model });
    onClose();
  }, [apiKey, model, onClose]);

  const handleClear = useCallback(() => {
    setAiConfig({});
    setApiKey('');
    setModel('gpt-4o-mini');
  }, []);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        ...shared.cardElevated,
        width: 480, maxWidth: '90vw',
        padding: theme.spacing.xl,
      }}>
        <div style={{
          fontSize: theme.font.lg, fontWeight: 700,
          color: theme.colors.text.primary, marginBottom: theme.spacing.lg,
        }}>
          Sprachaufnahme &ndash; Einstellungen
        </div>

        <div style={{ marginBottom: theme.spacing.md }}>
          <label style={{
            display: 'block', fontSize: theme.font.xs, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            color: theme.colors.text.muted, marginBottom: 6,
          }}>
            OpenAI API-Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            style={{
              ...shared.dashedInput,
              fontSize: theme.font.body,
              fontFamily: theme.fontMono,
            }}
          />
          <div style={{
            fontSize: theme.font.xs, color: theme.colors.text.muted,
            marginTop: 4, lineHeight: 1.5,
          }}>
            Wird nur lokal im Browser gespeichert. Ben&ouml;tigt f&uuml;r die KI-Zusammenfassung nach der Sprachaufnahme.
          </div>
        </div>

        <div style={{ marginBottom: theme.spacing.lg }}>
          <label style={{
            display: 'block', fontSize: theme.font.xs, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            color: theme.colors.text.muted, marginBottom: 6,
          }}>
            Modell
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={{
              ...shared.dashedInput,
              appearance: 'none',
              paddingRight: 30,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%234A5568' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              cursor: 'pointer',
            }}
          >
            {MODELS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: theme.spacing.sm, justifyContent: 'flex-end' }}>
          <button
            onClick={handleClear}
            style={{
              padding: '8px 18px', borderRadius: theme.radius.sm,
              border: '1px solid rgba(220,38,38,0.2)',
              background: theme.colors.danger.bg, color: theme.colors.danger.text,
              fontSize: theme.font.sm, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Key l&ouml;schen
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px', borderRadius: theme.radius.sm,
              border: `1px solid ${theme.colors.border.glass}`,
              background: theme.colors.bg.muted, color: theme.colors.text.secondary,
              fontSize: theme.font.sm, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            style={{
              padding: '8px 18px', borderRadius: theme.radius.sm,
              border: 'none',
              background: apiKey.trim()
                ? `linear-gradient(135deg, ${theme.colors.accent.indigoDark}, ${theme.colors.accent.indigo})`
                : theme.colors.bg.muted,
              color: apiKey.trim() ? '#fff' : theme.colors.text.muted,
              fontSize: theme.font.sm, fontWeight: 600, cursor: apiKey.trim() ? 'pointer' : 'default',
              boxShadow: apiKey.trim() ? theme.shadow.glow : 'none',
            }}
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
});

ApiKeyDialog.displayName = 'ApiKeyDialog';
export default ApiKeyDialog;
