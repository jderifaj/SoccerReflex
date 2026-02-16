import { useState, useEffect, useCallback, useRef } from "react";
import { TrainingColor } from "../types";

export const useVoiceGuidance = (colors: TrainingColor[], enabled: boolean) => {
  // We no longer need a real "loading" state for network buffers,
  // but we'll keep the interface compatible.
  const [isLoading, setIsLoading] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Initialize and find the best female voice
  const findBestVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    // Prioritize high-quality Google voices if available (usually available in Chrome/Edge)
    // then fall back to any female-sounding voice.
    const preferred =
      voices.find(
        (v) =>
          (v.name.includes("Google") &&
            v.name.toLowerCase().includes("female")) ||
          (v.name.includes("Google") && v.name.includes("US English")),
      ) ||
      voices.find(
        (v) =>
          v.name.toLowerCase().includes("female") ||
          v.name.includes("Samantha") ||
          v.name.includes("Victoria"),
      ) ||
      voices[0];

    voiceRef.current = preferred;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Voices are loaded asynchronously in many browsers
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = findBestVoice;
    }
    findBestVoice();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [enabled, findBestVoice]);

  const initAudio = useCallback(async () => {
    // Web Speech doesn't require AudioContext initialization,
    // but we can ensure a voice is picked and synthesis is ready.
    if (!voiceRef.current) findBestVoice();
    return true;
  }, [findBestVoice]);

  const playVoice = useCallback(
    (text: string) => {
      if (!enabled) return;

      // Cancel any current speech to ensure we play the newest color immediately
      // (critical for reaction time drills)
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) {
        utterance.voice = voiceRef.current;
      }

      // Coaching style settings
      utterance.rate = 1.1; // Slightly faster for training urgency
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      window.speechSynthesis.speak(utterance);
    },
    [enabled],
  );

  return { isLoading, playVoice, initAudio };
};
