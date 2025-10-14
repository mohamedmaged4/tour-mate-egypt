
// contexts.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from './hooks';
import { Language, Place } from './types';
import { UI_TRANSLATIONS } from './data';

// Define the shape of the context state
interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  governorate: string | null;
  setGovernorate: (gov: string | null) => void;
  favorites: Place[];
  addFavorite: (place: Place) => void;
  removeFavorite: (placeId: string) => void;
  isFavorite: (placeId: string) => boolean;
  t: (key: string) => string;
  showToast: (message: string) => void;
}

// Create the context with a default undefined value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Define the props for the provider component
interface AppProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the application and makes the global state
 * available to any child components that need it.
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('tourmate-theme', 'light');
  const [language, setLanguage] = useLocalStorage<Language>('tourmate-language', 'en');
  const [governorate, setGovernorate] = useLocalStorage<string | null>('tourmate-governorate', null);
  const [favorites, setFavorites] = useLocalStorage<Place[]>('tourmate-favorites', []);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  
  // Effect to apply the dark mode class to the html element
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Effect to set the document direction based on language
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  
  // Function to toggle between dark and light themes
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  // Functions to manage favorites
  const addFavorite = (place: Place) => {
    setFavorites(prev => [...prev, place]);
    showToast(t('addedToFavorites'));
  };
  
  const removeFavorite = (placeId: string) => {
    setFavorites(prev => prev.filter(p => p.id !== placeId));
    showToast(t('removedFromFavorites'));
  };

  const isFavorite = (placeId: string) => favorites.some(p => p.id === placeId);
  
  // Translation function
  const t = (key: string): string => {
    return UI_TRANSLATIONS[language][key] || key;
  };
  
  // Function to show a toast message
  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast({ message: '', visible: false });
    }, 3000);
  };

  const value = {
    theme,
    toggleTheme,
    language,
    setLanguage,
    governorate,
    setGovernorate,
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    t,
    showToast,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {/* Toast Component */}
      <div className={`fixed bottom-5 right-5 transition-transform duration-300 transform ${toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-amber-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg">
          {toast.message}
        </div>
      </div>
    </AppContext.Provider>
  );
};

/**
 * Custom hook to use the AppContext, ensuring it's used within an AppProvider.
 */
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
