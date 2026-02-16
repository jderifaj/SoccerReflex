
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'icon';

interface ButtonProps {
  onClick: () => void;
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ onClick, variant = 'primary', className = '', children }) => {
  const baseStyles = "font-black transition-all active:scale-95 disabled:opacity-50";
  const variants = {
    primary: "bg-white text-black hover:bg-slate-100 py-4 px-8 rounded-2xl shadow-2xl uppercase tracking-widest text-sm",
    secondary: "bg-slate-900 text-white border border-white/10 py-4 px-8 rounded-2xl",
    icon: "bg-slate-900 border border-white/10 text-white p-4 rounded-2xl flex items-center justify-center"
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};
