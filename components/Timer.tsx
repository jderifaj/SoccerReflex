
import React from 'react';
import { TrainingColor } from '../types';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
  accentColor: TrainingColor;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, totalTime, accentColor }) => (
  <div className="w-full flex flex-col items-center">
    <div className="bg-black/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-mono text-3xl font-black border border-white/10">
      {timeLeft}S
    </div>
    <div className="mt-8 w-full max-w-xs h-2 bg-black/20 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all duration-1000 ease-linear ${accentColor === 'Yellow' ? 'bg-black/40' : 'bg-white/40'}`}
        style={{ width: `${(timeLeft / totalTime) * 100}%` }}
      />
    </div>
  </div>
);
