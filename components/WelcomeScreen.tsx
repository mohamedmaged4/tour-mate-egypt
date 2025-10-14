
// components/WelcomeScreen.tsx

import React, { useState } from 'react';
import { EGYPT_DATA } from '../data';
import { useAppContext } from '../contexts';
import Icon from './Icon';

/**
 * The WelcomeScreen component is the first thing a new user sees.
 * It prompts them to select a governorate to start their journey.
 */
const WelcomeScreen: React.FC = () => {
  const { setGovernorate, language, t } = useAppContext();
  const [selected, setSelected] = useState('');

  const governorates = Object.values(EGYPT_DATA);

  const handleStart = () => {
    if (selected) {
      setGovernorate(selected);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md mx-auto text-center bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-105">
        <div className="mx-auto mb-6 h-24 w-24 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400">
            <Icon name="fa-solid fa-ankh" className="text-5xl" />
        </div>
        <h1 className="text-4xl font-bold text-amber-800 dark:text-amber-300 mb-2">{t('appName')}</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">{t('welcomeMessage')}</p>
        
        <div className="space-y-6">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full p-4 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            aria-label={t('selectGovernorate')}
          >
            <option value="" disabled>{t('selectGovernorate')}</option>
            {governorates.map(gov => (
              <option key={gov.id} value={gov.id}>{gov.name[language]}</option>
            ))}
          </select>
          
          <button
            onClick={handleStart}
            disabled={!selected}
            className="w-full bg-amber-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:bg-amber-600 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
          >
            {t('start')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
