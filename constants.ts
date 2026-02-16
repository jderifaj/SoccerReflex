
import { ColorDefinition, TrainingColor } from './types';

export const COLORS: ColorDefinition[] = [
  { name: 'Red', bgClass: 'bg-red-600', hex: '#dc2626' },
  { name: 'Orange', bgClass: 'bg-orange-500', hex: '#f97316' },
  { name: 'Green', bgClass: 'bg-emerald-500', hex: '#10b981' },
  { name: 'Yellow', bgClass: 'bg-yellow-400', hex: '#facc15' },
  { name: 'Blue', bgClass: 'bg-blue-600', hex: '#2563eb' },
];

export const DELAY_OPTIONS = [1, 2, 3, 5, 10];

export const STORAGE_KEY = 'soccer_reflex_favorites';
