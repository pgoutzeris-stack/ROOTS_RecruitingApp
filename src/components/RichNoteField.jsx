import { memo, useRef, useCallback, useState, useEffect } from 'react';
import { theme } from '../theme';
import { useVoiceRecorder } from './VoiceRecorder';

const toolbarBtnStyle = (active) => ({
  width: 30,
  height: 28,
  borderRadius: 4,
  border: `1px solid ${active ? theme.colors.accent.indigo : theme.colors.border.glass}`,
  background: active ? theme.colors.accent.indigoLight : 'transparent',
  color: active ? theme.colors.accent.indigo : theme.colors.text.muted,
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: active ? 700 : 500,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  transition: `all ${theme.transition.fast}`,
  fontFamily: 'inherit',
});

const RichNoteField = memo(({ value, onChange, placeholder, questionContext }) => {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const isInternalChange = useRef(false);

  // Voice recorder – appends AI summary to the field
  const handleVoiceResult = useCallback((html) => {
    const current = value || '';
    const separator = current && current !== '<br>' && current !== '<div><br></div>' ? '<br>' : '';
    onChange(current + separator + html);
  }, [value, onChange]);

  const { micBtn, banner } = useVoiceRecorder(handleVoiceResult, questionContext, toolbarBtnStyle);

  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (editorRef.current && editorRef.current.innerHTML !== (value || '')) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const execCmd = useCallback((cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const isEmpty = html === '<br>' || html === '<div><br></div>' || html === '';
      isInternalChange.current = true;
      onChange(isEmpty ? '' : html);
    }
  }, [onChange]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  const showPlaceholder = !value || value === '<br>' || value === '<div><br></div>';

  return (
    <div style={{ marginTop: theme.spacing.sm + 4 }}>
      <div style={{
        display: 'flex', gap: 4, padding: '4px 8px',
        background: theme.colors.bg.muted,
        borderRadius: `${theme.radius.md}px ${theme.radius.md}px 0 0`,
        border: `1px solid ${isFocused ? theme.colors.accent.indigo + '40' : theme.colors.border.glass}`,
        borderBottom: 'none',
        transition: `border-color ${theme.transition.fast}`,
        alignItems: 'center',
      }}>
        <button type="button" style={toolbarBtnStyle(false)} onClick={() => execCmd('bold')} title="Fett (Ctrl+B)">
          <strong>B</strong>
        </button>
        <button type="button" style={toolbarBtnStyle(false)} onClick={() => execCmd('italic')} title="Kursiv (Ctrl+I)">
          <em>I</em>
        </button>
        <button type="button" style={toolbarBtnStyle(false)} onClick={() => execCmd('insertUnorderedList')} title="Aufzählung">
          &#8226;
        </button>

        {/* Separator */}
        <div style={{ width: 1, height: 18, background: theme.colors.border.glass, margin: '0 4px' }} />

        {/* Voice recorder mic button */}
        {micBtn}
      </div>

      {/* Voice recorder status banner */}
      {banner}

      <div style={{ position: 'relative' }}>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          dir="ltr"
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onPaste={handlePaste}
          style={{
            width: '100%',
            minHeight: 80,
            padding: '12px 16px',
            border: `1px solid ${isFocused ? theme.colors.accent.indigo + '40' : theme.colors.border.glass}`,
            borderRadius: banner ? 0 : `0 0 ${theme.radius.md}px ${theme.radius.md}px`,
            fontSize: theme.font.body,
            fontFamily: 'inherit',
            background: '#FAFBFC',
            boxSizing: 'border-box',
            lineHeight: 1.7,
            transition: `border-color ${theme.transition.fast}`,
            color: theme.colors.text.primary,
            outline: 'none',
            whiteSpace: 'pre-wrap',
            overflowY: 'auto',
          }}
          className="note-field"
        />
        {showPlaceholder && (
          <div style={{
            position: 'absolute', top: 12, left: 16,
            color: theme.colors.text.muted, fontSize: theme.font.body,
            pointerEvents: 'none', opacity: 0.7,
          }}>
            {placeholder || 'Notizen ...'}
          </div>
        )}
      </div>
    </div>
  );
});

RichNoteField.displayName = 'RichNoteField';
export default RichNoteField;
