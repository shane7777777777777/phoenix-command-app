import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Voice dictation for form fields via the browser's Web Speech API.
 *
 * Honesty contract: `supported` is a real feature-detect — when the browser
 * ships no SpeechRecognition (some iOS/WebView builds), callers render a
 * disabled control with an explanation instead of a button that lies.
 * No audio leaves the device except through the browser's own speech service;
 * nothing is recorded or uploaded by the app itself.
 */

type SpeechRecognitionCtor = new () => any;

const getRecognitionCtor = (): SpeechRecognitionCtor | null => {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};

export type DictationLang = 'en' | 'es';

const BCP47: Record<DictationLang, string> = {
  en: 'en-US',
  es: 'es-US',
};

export interface VoiceDictation {
  supported: boolean;
  listening: boolean;
  /** Live interim transcript while speaking (already-final text is delivered via onFinal). */
  interim: string;
  /** Last error, cleared on the next start(). 'denied' | 'no-speech' | 'aborted' | other engine codes. */
  error: string | null;
  start: () => void;
  stop: () => void;
}

/**
 * @param lang    UI language from LanguageContext — dictation follows it.
 * @param onFinal Called with each FINAL transcript chunk (trailing space added);
 *                append it to the bound field's state.
 */
export function useVoiceDictation(lang: DictationLang, onFinal: (text: string) => void): VoiceDictation {
  const ctor = getRecognitionCtor();
  const supported = ctor !== null;

  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const onFinalRef = useRef(onFinal);
  onFinalRef.current = onFinal;
  // User-intent flag: distinguishes a tap on stop from the engine's own end
  // (mobile engines end sessions on silence; we restart only if still wanted).
  const wantedRef = useRef(false);

  const stop = useCallback(() => {
    wantedRef.current = false;
    recognitionRef.current?.stop();
    setListening(false);
    setInterim('');
  }, []);

  const start = useCallback(() => {
    if (!ctor || recognitionRef.current) return;
    setError(null);

    const rec = new ctor();
    rec.lang = BCP47[lang];
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event: any) => {
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const text = String(result[0]?.transcript ?? '').trim();
          if (text) onFinalRef.current(text + ' ');
        } else {
          interimText += result[0]?.transcript ?? '';
        }
      }
      setInterim(interimText);
    };

    rec.onerror = (event: any) => {
      const code = event?.error === 'not-allowed' || event?.error === 'service-not-allowed' ? 'denied' : String(event?.error ?? 'unknown');
      setError(code);
      wantedRef.current = false;
    };

    rec.onend = () => {
      recognitionRef.current = null;
      setInterim('');
      if (wantedRef.current) {
        // Engine ended on its own (silence timeout) while the tech still wants
        // dictation — restart to keep hands-free entry going.
        try {
          start();
          return;
        } catch {
          /* fall through to listening=false */
        }
      }
      setListening(false);
    };

    try {
      rec.start();
      recognitionRef.current = rec;
      wantedRef.current = true;
      setListening(true);
    } catch {
      setError('start-failed');
      recognitionRef.current = null;
      setListening(false);
    }
  }, [ctor, lang]);

  // Never leave the microphone open past unmount.
  useEffect(() => () => {
    wantedRef.current = false;
    recognitionRef.current?.stop();
  }, []);

  return { supported, listening, interim, error, start, stop };
}
