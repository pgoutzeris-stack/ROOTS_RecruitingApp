import { memo } from 'react';
import { theme } from '../theme';

const InfoBar = memo(({ isZweit }) => (
  <div
    style={{
      background: theme.colors.info.bg,
      padding: '14px 32px 14px 252px',
      fontSize: theme.font.body,
      color: theme.colors.info.text,
      lineHeight: 1.7,
      borderBottom: `1px solid ${theme.colors.info.border}`,
    }}
    className="no-print"
  >
    <span style={{ fontWeight: 700 }}>Hinweis:</span>{' '}
    Wähle pro Phase Fragen aus, hake gestellte ab, notiere Stichworte und bewerte per
    ausklappbarem Evaluationsanker.{' '}
    {isZweit && 'Grau hinterlegte Fragen wurden im Erstgespräch bereits gestellt. Bewertungen (EG) und Notizen (Notizen EG) sind übernommen. '}
    Offene Fragen kann der/die nächste Interviewer:in stellen.
  </div>
));

InfoBar.displayName = 'InfoBar';
export default InfoBar;
