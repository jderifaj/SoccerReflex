
import React from 'react';
import { ColorDefinition } from '../types';

interface ColorProps {
  color: ColorDefinition;
  isSelected: boolean;
  onClick: () => void;
}

export const Color: React.FC<ColorProps> = ({ color, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`
      aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300
      ${isSelected ? 'ring-2 ring-offset-2 ring-offset-black ring-white scale-110 opacity-100' : 'opacity-20 grayscale scale-95'}
      ${color.bgClass} shadow-2xl
    `}
  >
    <span className={`text-[10px] font-black uppercase ${color.name === 'Yellow' ? 'text-black' : 'text-white'}`}>
      {color.name[0]}
    </span>
  </button>
);
