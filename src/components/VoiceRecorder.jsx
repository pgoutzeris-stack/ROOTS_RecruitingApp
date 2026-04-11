import { useState, useRef, useCallback } from 'react';
import { theme } from '../theme';
import { summarizeTranscript, getAiConfig } from '../utils/ai';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

/**
 * useVoiceRecorder – hook for speech-to-text with AI summarisation.
 *
 * Returns:
 *  - micBtn   : JSX button element to place in a toolbar
 *  - banner   : JSX status banner (recording / processing / error) or null
 *
 * @param {function} onResult        – called with the AI-generated summary (HTML string)
 * @param {string}   questionContext  – optional question text for better summarisation
 * @param {function} toolbarBtnStyle – style factory (active: boolean) => CSSProperties
 */
export function useVoiceRecorder(onResult, questionContext, toolbarBtnStyle) {
  const [status, setStatus] = useState('idle'); // idle | recording | processing | error
  const [liveText, setLiveText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const recognitionRef = useRef(null);
  const finalRef = useRef('');
  const statusRef = useRef('idle');

  const isSupported = !!SpeechRecognition;

  const processTranscript = useCallback(async (text) => {
    if (!text.trim()) {
      statusRef.current = 'idle';
      setStatus('idle');
      setLiveText('');
      return;
    }

    statusRef.current = 'processing';
    setStatus('processing');

    try {
      const summary = await summarizeTranscript(text, questionContext);
      onResult(summary);
      statusRef.current = 'idle';
      setStatus('idle');
      setLiveText('');
    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        setErrorMsg('Bitte OpenAI API-Key in den Einstellungen hinterlegen (\u2699-Symbol im Header).');
      } else {
        setErrorMsg(err.message);
        // Insert raw transcript as fallback
        onResult(`<p>${text}</p>`);
      }
      statusRef.current = 'error';
      setStatus('error');
    }
  }, [onResult, questionContext]);

  const startRecording = useCallback(() => {
    if (!isSupported) {
      setErrorMsg('Spracherkennung wird in diesem Browser nicht unterst\u00FCtzt. Bitte Chrome oder Edge verwenden.');
      setStatus('error');
      statusRef.current = 'error';
      return;
    }

    const config = getAiConfig();
    if (!config.apiKey) {
      setErrorMsg('Bitte zuerst einen OpenAI API-Key in den Einstellungen hinterlegen (\u2699-Symbol im Header).');
      setStatus('error');
      statusRef.current = 'error';
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.continuous = true;
    recognition.interimResults = true;

    finalRef.current = '';
    setLiveText('');
    setErrorMsg('');

    recognition.onresult = (event) => {
      let finalText = '';
      let interim = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      finalRef.current = finalText;
      setLiveText(finalText + interim);
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setErrorMsg('Mikrofon-Zugriff wurde verweigert. Bitte Berechtigung erteilen.');
      } else if (event.error !== 'aborted') {
        setErrorMsg(`Spracherkennung-Fehler: ${event.error}`);
      }
      recognitionRef.current = null;
      statusRef.current = 'error';
      setStatus('error');
    };

    recognition.onend = () => {
      // If still in recording state, recognition ended unexpectedly (timeout / silence)
      if (statusRef.current === 'recording') {
        recognitionRef.current = null;
        processTranscript(finalRef.current);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    statusRef.current = 'recording';
    setStatus('recording');
  }, [isSupported, processTranscript]);

  const stopRecording = useCallback(() => {
    statusRef.current = 'stopping'; // prevent onend from double-processing
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    processTranscript(finalRef.current);
  }, [processTranscript]);

  const toggle = useCallback(() => {
    if (status === 'recording') {
      stopRecording();
    } else if (status === 'idle' || status === 'error') {
      startRecording();
    }
  }, [status, startRecording, stopRecording]);

  const dismiss = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    statusRef.current = 'idle';
    setStatus('idle');
    setErrorMsg('');
    setLiveText('');
  }, []);

  // ── Mic button (toolbar) ──
  const isRecording = status === 'recording';
  const micBtn = (
    <button
      type="button"
      onClick={toggle}
      disabled={status === 'processing'}
      title={isRecording ? 'Aufnahme stoppen' : 'Sprachaufnahme starten'}
      style={{
        ...toolbarBtnStyle(isRecording),
        color: isRecording ? '#DC2626' : status === 'processing' ? theme.colors.text.muted : theme.colors.accent.indigo,
        borderColor: isRecording ? 'rgba(220,38,38,0.4)' : status === 'processing' ? theme.colors.border.glass : `${theme.colors.accent.indigo}40`,
        background: isRecording ? 'rgba(220,38,38,0.08)' : status === 'processing' ? theme.colors.bg.muted : theme.colors.accent.indigoLight,
        position: 'relative',
        overflow: 'visible',
        opacity: status === 'processing' ? 0.5 : 1,
        cursor: status === 'processing' ? 'wait' : 'pointer',
      }}
    >
      {isRecording && (
        <span className="voice-rec-pulse" style={{
          position: 'absolute', top: -2, right: -2,
          width: 8, height: 8, borderRadius: '50%',
          background: '#DC2626',
        }} />
      )}
      {status === 'processing' ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="voice-rec-spin">
          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="1" width="6" height="12" rx="3" />
          <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
          <line x1="12" y1="18" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      )}
    </button>
  );

  // ── Status banner ──
  let banner = null;

  if (status === 'recording') {
    banner = (
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 8,
        padding: '8px 12px', marginTop: 6,
        background: 'rgba(220,38,38,0.04)',
        border: '1px solid rgba(220,38,38,0.15)',
        borderRadius: theme.radius.sm,
        fontSize: theme.font.sm, lineHeight: 1.5, color: '#991B1B',
      }}>
        <span className="voice-rec-pulse" style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#DC2626', flexShrink: 0, marginTop: 4,
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>Aufnahme l&auml;uft&hellip;</div>
          {liveText && (
            <div style={{ color: '#7F1D1D', opacity: 0.7, fontStyle: 'italic', maxHeight: 60, overflow: 'hidden', wordBreak: 'break-word' }}>
              {liveText.slice(-200)}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={stopRecording}
          style={{
            padding: '4px 12px', borderRadius: theme.radius.sm,
            border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.08)',
            color: '#DC2626', fontSize: theme.font.xs, fontWeight: 600,
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          Stoppen
        </button>
      </div>
    );
  }

  if (status === 'processing') {
    banner = (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px', marginTop: 6,
        background: theme.colors.info.bg,
        border: `1px solid ${theme.colors.info.border}`,
        borderRadius: theme.radius.sm,
        fontSize: theme.font.sm, color: theme.colors.info.text,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="voice-rec-spin" style={{ flexShrink: 0 }}>
          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
        </svg>
        <span style={{ fontWeight: 500 }}>Zusammenfassung wird erstellt&hellip;</span>
      </div>
    );
  }

  if (status === 'error' && errorMsg) {
    banner = (
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 8,
        padding: '8px 12px', marginTop: 6,
        background: theme.colors.danger.bg,
        border: '1px solid rgba(220,38,38,0.15)',
        borderRadius: theme.radius.sm,
        fontSize: theme.font.sm, color: theme.colors.danger.text,
      }}>
        <span style={{ flexShrink: 0 }}>&#9888;</span>
        <span style={{ flex: 1 }}>{errorMsg}</span>
        <button
          type="button"
          onClick={dismiss}
          style={{
            background: 'none', border: 'none', color: theme.colors.danger.text,
            cursor: 'pointer', fontSize: theme.font.sm, fontWeight: 600,
            padding: '0 4px', flexShrink: 0,
          }}
        >
          &#10005;
        </button>
      </div>
    );
  }

  return { micBtn, banner };
}
