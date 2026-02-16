
import React from 'react';

interface ChangeIntervalProps {
  currentValue: number;
  options: number[];
  onChange: (value: number) => void;
}

export const ChangeInterval: React.FC<ChangeIntervalProps> = ({ currentValue, options, onChange }) => {
  return (
    <section className="mb-10">
      <h2 className="text-sm font-bold mb-4 text-slate-400 uppercase tracking-widest">Change Interval</h2>
      <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`
              flex-1 py-3 rounded-xl text-xs font-black transition-all
              ${currentValue === opt ? 'bg-white text-black shadow-xl scale-100' : 'text-slate-500 hover:text-slate-300'}
            `}
          >
            {opt}S
          </button>
        ))}
      </div>
    </section>
  );
};
