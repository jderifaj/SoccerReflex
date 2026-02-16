
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TrainingConfig, TrainingColor } from '../types';
import { COLORS } from '../constants';
import { Timer } from './Timer';

interface TrainingScreenProps {
  config: TrainingConfig;
  onStop: () => void;
}

const TrainingScreen: React.FC<TrainingScreenProps> = ({ config, onStop }) => {
  const [currentColor, setCurrentColor] = useState<TrainingColor>(
    config.selectedColors[Math.floor(Math.random() * config.selectedColors.length)]
  );
  const [timeLeft, setTimeLeft] = useState(config.delaySeconds);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const getNextColor = useCallback(() => {
    const others = config.selectedColors.filter(c => c !== currentColor);
    return others[Math.floor(Math.random() * others.length)];
  }, [config.selectedColors, currentColor]);

  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCurrentColor(getNextColor());
          return config.delaySeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, config.delaySeconds, getNextColor]);

  const colorData = COLORS.find(c => c.name === currentColor)!;
  const isYellow = currentColor === 'Yellow';
  const textColor = isYellow ? 'text-black' : 'text-white';
  const btnBg = isYellow ? 'bg-black text-yellow-400 hover:bg-slate-900' : 'bg-white text-slate-900 hover:bg-slate-100';
  const secondaryBtnBg = isYellow ? 'bg-black/10 border-black/20 text-black hover:bg-black/20' : 'bg-white/10 border-white/20 text-white hover:bg-white/20';

  return (
    <div className={`fixed inset-0 flex flex-col transition-colors duration-500 ${colorData.bgClass}`}>
      {/* HUD Header - Space preserved for immersive feel */}
      <div className="h-20" />

      {/* Main Focus Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-12 text-center">
        <h2 className={`text-7xl md:text-9xl font-black uppercase tracking-tighter italic drop-shadow-2xl mb-8 ${textColor}`}>
          {currentColor}
        </h2>
        
        <Timer 
          timeLeft={timeLeft} 
          totalTime={config.delaySeconds} 
          accentColor={currentColor} 
        />
      </div>

      {/* Control Footer */}
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
          onClick={() => setIsPaused(!isPaused)}
          className={`
            w-full sm:w-auto px-12 py-5 rounded-3xl font-black text-xl transition-all shadow-2xl active:scale-90 hover:scale-105 hover:brightness-110 uppercase tracking-widest
            ${btnBg}
          `}
        >
          {isPaused ? 'RESUME' : 'PAUSE'}
        </button>
      </div>
    </div>
  );
};

export default TrainingScreen;
