
import React, { useState, useEffect } from 'react';
import ConfigScreen from './components/ConfigScreen';
import TrainingScreen from './components/TrainingScreen';
import { AppState, TrainingConfig, FavoriteCombo } from './types';
import { STORAGE_KEY } from './constants';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppState>(AppState.SETUP);
  const [config, setConfig] = useState<TrainingConfig>({
    selectedColors: ['Red', 'Green', 'Blue'],
    delaySeconds: 5
  });
  const [favorites, setFavorites] = useState<FavoriteCombo[]>([]);

  // Load favorites on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
  }, []);

  const saveFavorite = (name: string) => {
    const newFav: FavoriteCombo = {
      ...config,
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now()
    };
    const updated = [newFav, ...favorites].slice(0, 10); // Keep last 10
    setFavorites(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteFavorite = (id: string) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const loadFavorite = (fav: FavoriteCombo) => {
    setConfig({
      selectedColors: fav.selectedColors,
      delaySeconds: fav.delaySeconds
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {currentStep === AppState.SETUP ? (
        <ConfigScreen 
          config={config} 
          setConfig={setConfig} 
          onStart={() => setCurrentStep(AppState.TRAINING)}
          favorites={favorites}
          onSaveFavorite={saveFavorite}
          onLoadFavorite={loadFavorite}
          onDeleteFavorite={deleteFavorite}
        />
      ) : (
        <TrainingScreen 
          config={config} 
          onStop={() => setCurrentStep(AppState.SETUP)} 
        />
      )}
    </div>
  );
};

export default App;