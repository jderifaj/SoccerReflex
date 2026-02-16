import React, { useState, useEffect, useCallback, useRef } from "react";
import { TrainingConfig, TrainingColor } from "../types";
import { COLORS } from "../constants";
import { Timer } from "./Timer";
import { useVoiceGuidance } from "../hooks/useVoiceGuidance";

interface TrainingScreenProps {
  config: TrainingConfig;
  onStop: () => void;
}

const TrainingScreen: React.FC<TrainingScreenProps> = ({ config, onStop }) => {
  const [currentColor, setCurrentColor] = useState<TrainingColor>(
    config.selectedColors[
      Math.floor(Math.random() * config.selectedColors.length)
    ],
  );
  const [timeLeft, setTimeLeft] = useState(config.delaySeconds);
  const [isPaused, setIsPaused] = useState(false);

  // Track the color currently being announced to avoid misses or double-announcements
  const lastVoicedColorRef = useRef<string | null>(null);

  const intervalRef = useRef<number | null>(null);
  const { isLoading, playVoice, initAudio } = useVoiceGuidance(
    config.selectedColors,
    config.voiceEnabled,
  );

  // Initialize on mount
  useEffect(() => {
    initAudio();
  }, [initAudio]);

  const getNextColor = useCallback(() => {
    const others = config.selectedColors.filter((c) => c !== currentColor);
    // If only 1 color is selected, we have to allow repeats, otherwise pick from others
    if (others.length === 0) return currentColor;
    return others[Math.floor(Math.random() * others.length)];
  }, [config.selectedColors, currentColor]);

  // Reliable voice playback trigger
  useEffect(() => {
    if (config.voiceEnabled && !isLoading && !isPaused) {
      // Check if this color needs voicing
      if (lastVoicedColorRef.current !== currentColor) {
        playVoice(currentColor);
        lastVoicedColorRef.current = currentColor;
      }
    }
  }, [currentColor, config.voiceEnabled, isLoading, isPaused, playVoice]);

  // Main Cycle Timer
  useEffect(() => {
    if (isPaused || isLoading) return;

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const next = getNextColor();
          // Reset voiced ref if we're picking the same color (e.g. only 1 color selected)
          // so it plays again even if the color string is technically identical.
          if (next === currentColor) {
            lastVoicedColorRef.current = null;
          }
          setCurrentColor(next);
          return config.delaySeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, isLoading, config.delaySeconds, getNextColor, currentColor]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-6" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">
          Preparing Voice Engine...
        </p>
      </div>
    );
  }

  const colorData = COLORS.find((c) => c.name === currentColor)!;
  const isYellow = currentColor === "Yellow";
  const textColor = isYellow ? "text-black" : "text-white";
  const btnBg = isYellow
    ? "bg-black text-yellow-400 hover:bg-slate-900"
    : "bg-white text-slate-900 hover:bg-slate-100";
  const secondaryBtnBg = isYellow
    ? "bg-black/10 border-black/20 text-black hover:bg-black/20"
    : "bg-white/10 border-white/20 text-white hover:bg-white/20";

  return (
    <div
      className={`fixed inset-0 flex flex-col transition-colors duration-500 ${colorData.bgClass}`}
    >
      <div className="h-20" />

      <div className="flex-1 flex flex-col items-center justify-center px-12 text-center">
        <h2
          className={`text-7xl md:text-9xl font-black uppercase tracking-tighter italic drop-shadow-2xl mb-8 ${textColor}`}
        >
          {currentColor}
        </h2>

        <Timer
          timeLeft={timeLeft}
          totalTime={config.delaySeconds}
          accentColor={currentColor}
        />
      </div>

      <div className="p-8 pb-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={onStop}
          className={`
            w-full sm:w-auto px-8 py-5 rounded-3xl font-bold text-lg transition-all border backdrop-blur-md active:scale-95 hover:scale-105 uppercase tracking-widest
            ${secondaryBtnBg}
          `}
        >
          Return to Main
        </button>

        <button
          onClick={() => {
            initAudio();
            setIsPaused(!isPaused);
          }}
          className={`
            w-full sm:w-auto px-12 py-5 rounded-3xl font-black text-xl transition-all shadow-2xl active:scale-90 hover:scale-105 hover:brightness-110 uppercase tracking-widest
            ${btnBg}
          `}
        >
          {isPaused ? "RESUME" : "PAUSE"}
        </button>
      </div>
    </div>
  );
};

export default TrainingScreen;
