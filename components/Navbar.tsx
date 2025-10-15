// components/Navbar.tsx

import React from 'react';
import { useAppContext } from '../contexts';
import { Language } from '../types';
import Icon from './Icon';

interface NavbarProps {
  onFavoritesClick: () => void;
  onAboutClick: () => void;
  onSettingsClick: () => void;
}

/**
 * The application's main navigation bar.
 * Provides controls for favorites, about, and settings.
 */
const Navbar: React.FC<NavbarProps> = ({ onFavoritesClick, onAboutClick, onSettingsClick }) => {
  const { t } = useAppContext();
  
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
          <button onClick={onFavoritesClick} className="nav-icon-button" aria-label={t('favorites')}>
            <Icon name="fa-solid fa-heart" />
          </button>

          <button onClick={onAboutClick} className="nav-icon-button" aria-label={t('about')}>
            <Icon name="fa-solid fa-info-circle" />
          </button>
          
          <button onClick={onSettingsClick} className="nav-icon-button" aria-label={t('settings')}>
            <Icon name="fa-solid fa-cog" />
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