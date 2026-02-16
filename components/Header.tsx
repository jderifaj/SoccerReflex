
import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onBack }) => (
  <header className="mb-10 text-center relative">
    {onBack && (
      <button 
        onClick={onBack}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-slate-900 border border-white/10 text-white p-2 rounded-xl active:scale-90 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
    )}
    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">{title}</h1>
    {subtitle && <p className="text-slate-400 mt-2 text-sm font-medium">{subtitle}</p>}
  </header>
);
