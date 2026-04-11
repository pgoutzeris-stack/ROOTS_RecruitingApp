/**
 * AI utilities – API key management + transcript summarisation.
 *
 * Uses OpenAI-compatible chat completions endpoint (gpt-4o-mini by default).
 * API key is stored in localStorage so it never leaves the browser.
 */

const STORAGE_KEY = 'roots-ai-config';

export const getAiConfig = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

export const setAiConfig = (config) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

/**
 * Summarise an interview transcript into concise HTML bullet points.
 *
 * @param {string} transcript  – raw speech-to-text output
 * @param {string} questionContext – the interview question (optional, improves quality)
 * @returns {Promise<string>} HTML string (e.g. <ul><li>…</li></ul>)
 */
export const summarizeTranscript = async (transcript, questionContext = '') => {
  const config = getAiConfig();
  if (!config.apiKey) {
    throw new Error('NO_API_KEY');
  }

  const systemPrompt =
    'Du bist ein Assistent für strukturierte Recruiting-Interviews. ' +
    'Fasse die Antwort des Kandidaten in prägnanten Stichpunkten zusammen. ' +
    'Behalte die wichtigsten Inhalte, Fakten, Beispiele und Aussagen bei. ' +
    'Schreibe auf Deutsch. Formatiere als HTML-Liste mit <ul><li> Tags. ' +
    'Keine Überschriften, kein Einleitungstext – nur die Stichpunkte.';

  const userPrompt = questionContext
    ? `Interviewfrage: ${questionContext}\n\nAntwort des Kandidaten (Transkript):\n${transcript}`
    : `Antwort des Kandidaten (Transkript):\n${transcript}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 600,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error?.message || `API-Fehler ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};
