
import React, { useRef, useEffect, useState } from 'react';
import { TrainingColor, TrainingConfig, FavoriteCombo } from '../types';
import { COLORS, DELAY_OPTIONS } from '../constants';
import { Header } from './Header';
import { Color } from './Color';
import { Button } from './Button';
import { ChangeInterval } from './ChangeInterval';
import gsap from 'gsap';

interface ConfigScreenProps {
  config: TrainingConfig;
  setConfig: React.Dispatch<React.SetStateAction<TrainingConfig>>;
  onStart: () => void;
  favorites: FavoriteCombo[];
  onSaveFavorite: (name: string) => void;
  onLoadFavorite: (fav: FavoriteCombo) => void;
  onDeleteFavorite: (id: string) => void;
}

const ConfigScreen: React.FC<ConfigScreenProps> = ({
  config,
  setConfig,
  onStart,
  favorites,
  onSaveFavorite,
  onLoadFavorite,
  onDeleteFavorite
}) => {
  const [btnSize, setBtnSize] = useState({ width: 0, height: 0 });
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const segmentsRef = useRef<(SVGRectElement | null)[]>([]);

  // Measure button size to draw precise SVG border
  useEffect(() => {
    const updateSize = () => {
      if (buttonContainerRef.current) {
        const btn = buttonContainerRef.current.querySelector('button');
        if (btn) {
          setBtnSize({
            width: btn.offsetWidth,
            height: btn.offsetHeight
          });
        }
      }
    };
    
    updateSize();
    const timeout = setTimeout(updateSize, 100);
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      clearTimeout(timeout);
    };
  }, []);

  const radius = 16;
  const perimeter = 2 * (btnSize.width + btnSize.height - 4 * radius) + 2 * Math.PI * radius;
  const segmentLength = perimeter / config.selectedColors.length;

  useEffect(() => {
    if (btnSize.width > 0 && segmentsRef.current.length > 0) {
      gsap.killTweensOf(segmentsRef.current);
      segmentsRef.current.forEach((rect, i) => {
        if (!rect) return;
        const initialOffset = -i * segmentLength;
        gsap.set(rect, { strokeDashoffset: initialOffset });
        gsap.to(rect, {
          strokeDashoffset: initialOffset - perimeter,
          duration: 3,
          repeat: -1,
          ease: "none"
        });
      });
    }
  }, [btnSize, config.selectedColors, perimeter, segmentLength]);

  const toggleColor = (color: TrainingColor) => {
    setConfig(prev => {
      const exists = prev.selectedColors.includes(color);
      if (exists) {
        if (prev.selectedColors.length <= 2) return prev;
        return { ...prev, selectedColors: prev.selectedColors.filter(c => c !== color) };
      }
      if (prev.selectedColors.length >= 5) return prev;
      return { ...prev, selectedColors: [...prev.selectedColors, color] };
    });
  };

  const handleSave = () => {
    const name = prompt('Name this pattern (e.g., "Speed Agility"):');
    if (name) onSaveFavorite(name);
  };

  const strokeWidth = 6;
  const padding = 20;
  const svgWidth = btnSize.width + padding * 2;
  const svgHeight = btnSize.height + padding * 2;

  return (
    <div className="max-w-md mx-auto p-6 pb-20">
      <Header title="Soccer Reflex" subtitle="Reaction Training Pro" />

      {/* Color Selection */}
      <section className="mb-10">
        <h2 className="text-sm font-bold mb-4 flex justify-between items-center text-slate-400 uppercase tracking-widest">
          <span>Drill Colors</span>
          <span className="text-xs font-mono">{config.selectedColors.length}/5</span>
        </h2>
        <div className="grid grid-cols-5 gap-4">
          {COLORS.map(c => (
            <Color 
              key={c.name}
              color={c}
              isSelected={config.selectedColors.includes(c.name)}
              onClick={() => toggleColor(c.name)}
            />
          ))}
        </div>
      </section>

      {/* Pattern: Change Interval */}
      <ChangeInterval 
        currentValue={config.delaySeconds}
        options={DELAY_OPTIONS}
        onChange={(val) => setConfig(prev => ({ ...prev, delaySeconds: val }))}
      />

      {/* Primary Actions */}
      <section className="mb-16">
        <div className="relative flex justify-center items-center group cursor-pointer" ref={buttonContainerRef} onClick={onStart}>
          {/* Animated Border SVG */}
          {btnSize.width > 0 && (
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="absolute pointer-events-none z-0 overflow-visible transition-transform duration-300 group-hover:scale-[1.05]"
            >
              <g>
                {config.selectedColors.map((colorName, i) => {
                  const colorDef = COLORS.find(c => c.name === colorName);
                  return (
                    <rect
                      key={`${colorName}-${i}-${config.selectedColors.length}`}
                      ref={el => { segmentsRef.current[i] = el; }}
                      x={padding}
                      y={padding}
                      width={btnSize.width}
                      height={btnSize.height}
                      rx={radius}
                      ry={radius}
                      fill="none"
                      stroke={colorDef?.hex}
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${segmentLength} ${perimeter - segmentLength}`}
                      className="transition-[stroke,filter] duration-500"
                      style={{ filter: `drop-shadow(0 0 12px ${colorDef?.hex}aa)` }}
                    />
                  );
                })}
              </g>
            </svg>
          )}

          <Button 
            variant="primary" 
            onClick={() => {}} // onClick handled by parent div to sync with SVG
            className="w-full py-10 text-3xl shadow-2xl transition-all duration-300 bg-white text-black font-black italic tracking-tighter uppercase relative z-10 group-hover:bg-slate-50 group-hover:scale-[1.03] group-active:scale-95"
          >
            Launch Drill
          </Button>
        </div>
        
        <div className="mt-16">
          <Button 
            variant="secondary" 
            onClick={handleSave} 
            className="w-full flex items-center justify-center gap-3 text-sm uppercase tracking-widest opacity-70 hover:opacity-100 hover:bg-slate-800 hover:border-white/30 hover:-translate-y-1 transition-all border-dashed py-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Save Pattern
          </Button>
        </div>
      </section>

      {/* Favorites */}
      {favorites.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-bold mb-4 text-slate-400 uppercase tracking-widest border-t border-white/5 pt-8">My Presets</h2>
          <div className="space-y-3">
            {favorites.map(fav => (
              <div key={fav.id} className="flex items-center gap-3 bg-slate-900/40 p-4 rounded-2xl border border-white/5 shadow-lg group hover:bg-slate-900 transition-colors">
                <button 
                  onClick={() => onLoadFavorite(fav)}
                  className="flex-1 text-left"
                >
                  <div className="font-bold text-white text-sm group-hover:text-white transition-colors">{fav.name}</div>
                  <div className="flex items-center gap-1.5 mt-2">
                    {fav.selectedColors.map(c => (
                      <div key={c} className={`w-2.5 h-2.5 rounded-full ${COLORS.find(col => col.name === c)?.bgClass}`} />
                    ))}
                    <span className="text-[10px] text-slate-500 font-mono ml-2 uppercase">{fav.delaySeconds}S interval</span>
                  </div>
                </button>
                <button onClick={() => onDeleteFavorite(fav.id)} className="p-2 text-slate-600 hover:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ConfigScreen;
