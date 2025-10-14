
// components/Navbar.tsx

import React from 'react';
import { useAppContext } from '../contexts';
import { Language } from '../types';
import Icon from './Icon';

interface NavbarProps {
  onFavoritesClick: () => void;
  onAboutClick: () => void;
}

/**
 * The application's main navigation bar.
 * Provides controls for theme, language, favorites, and changing governorate.
 */
const Navbar: React.FC<NavbarProps> = ({ onFavoritesClick, onAboutClick }) => {
  const { theme, toggleTheme, language, setLanguage, setGovernorate, t } = useAppContext();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };
  
  const handleResetGovernorate = () => {
    if (window.confirm(t('changeGovernorate') + '?')) {
        setGovernorate(null);
    }
  };

  return (
    <nav className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and App Name */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400">
            <Icon name="fa-solid fa-ankh" className="text-xl"/>
          </div>
          <span className="hidden sm:block text-xl font-bold text-amber-800 dark:text-amber-300">{t('appName')}</span>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-200 dark:bg-slate-700 rounded-full p-1">
            {(['en', 'fr', 'ar'] as Language[]).map(lang => (
              <button 
                key={lang} 
                onClick={() => handleLanguageChange(lang)}
                className={`px-2 py-1 text-xs sm:text-sm font-bold rounded-full transition-colors ${language === lang ? 'bg-amber-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          
          <button onClick={toggleTheme} className="nav-icon-button" aria-label="Toggle theme">
            <Icon name={theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'} />
          </button>
          
          <button onClick={onFavoritesClick} className="nav-icon-button" aria-label="View favorites">
            <Icon name="fa-solid fa-heart" />
          </button>

          <button onClick={onAboutClick} className="nav-icon-button" aria-label="About app">
            <Icon name="fa-solid fa-info-circle" />
          </button>

          <button onClick={handleResetGovernorate} className="nav-icon-button" aria-label="Change governorate">
            <Icon name="fa-solid fa-map" />
          </button>
        </div>
      </div>
      <style>{`
        .nav-icon-button {
          @apply h-10 w-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
