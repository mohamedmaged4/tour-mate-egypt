// App.tsx

import React, { useState } from 'react';
import { useAppContext } from './contexts';
import WelcomeScreen from './components/WelcomeScreen';
import Navbar from './components/Navbar';
import MainContent from './components/MainContent';
import { Language, Place } from './types';
import Icon from './components/Icon';
import { EGYPT_DATA } from './data';
import RafiqiModal from './components/RafiqiModal';

/**
 * A generic modal component for displaying content like 'About' or 'Favorites'.
 */
const GenericModal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col animate-slide-up" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
        <h2 className="text-xl font-bold text-amber-800 dark:text-amber-300">{title}</h2>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white">
          <Icon name="fa-solid fa-times" />
        </button>
      </div>
      <div className="p-6 overflow-y-auto">
        {children}
      </div>
    </div>
     <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0.8; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
  </div>
);

/**
 * Component to display the list of favorited places.
 */
const FavoritesContent: React.FC = () => {
    const { favorites, removeFavorite, language, t } = useAppContext();

    if (favorites.length === 0) {
        return <p className="text-slate-500 dark:text-slate-400 text-center">{t('noFavorites')}</p>;
    }

    return (
        <div className="space-y-4">
            {favorites.map((place: Place) => (
                <div key={place.id} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-4">
                        <img src={place.images[0]} alt={place.name[language]} className="w-16 h-16 object-cover rounded-md"/>
                        <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{place.name[language]}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{place.shortDescription[language]}</p>
                        </div>
                    </div>
                    <button onClick={() => removeFavorite(place.id)} className="text-red-500 hover:text-red-700 px-2">
                        <Icon name="fa-solid fa-trash" />
                    </button>
                </div>
            ))}
        </div>
    );
};

/**
 * Component to display the settings options.
 */
const SettingsContent: React.FC = () => {
    const { theme, toggleTheme, language, setLanguage, t, governorate, setGovernorate } = useAppContext();
    const governoratesList = Object.values(EGYPT_DATA);

    return (
        <div className="space-y-6">
            {/* Governorate Settings */}
            <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-300">{t('governorate')}</h3>
                <select
                    value={governorate || ''}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full p-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    aria-label={t('selectGovernorate')}
                >
                    {governoratesList.map(gov => (
                        <option key={gov.id} value={gov.id}>{gov.name[language]}</option>
                    ))}
                </select>
            </div>

            {/* Language Settings */}
            <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-300">{t('language')}</h3>
                <div className="flex flex-wrap gap-2">
                    {(['en', 'fr', 'ar', 'it', 'de', 'ru', 'zh'] as Language[]).map(lang => (
                        <button 
                            key={lang} 
                            onClick={() => setLanguage(lang)}
                            className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${language === lang ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500'}`}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Appearance Settings */}
            <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-300">{t('appearance')}</h3>
                <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                     <span className="font-medium text-slate-800 dark:text-slate-200">{theme === 'light' ? t('lightTheme') : t('darkTheme')}</span>
                     <button onClick={toggleTheme} className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-slate-300 dark:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * The main App component. It acts as a router, displaying the WelcomeScreen
 * if no governorate is selected, or the main application interface otherwise.
 * It also manages the visibility of the About and Favorites modals.
 */
function App() {
  const { governorate, t, language } = useAppContext();
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRafiqi, setShowRafiqi] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Conditional rendering based on whether a governorate has been selected.
  if (!governorate) {
    return <WelcomeScreen />;
  }

  // If a governorate is selected, show the main app layout.
  return (
    <div className={`font-sans bg-stone-50 dark:bg-slate-900 min-h-screen ${language === 'ar' ? 'font-cairo' : 'font-sans'}`}>
      <Navbar 
        onFavoritesClick={() => setShowFavorites(true)} 
        onAboutClick={() => setShowAbout(true)}
        onSettingsClick={() => setShowSettings(true)}
        onCategoriesClick={() => setIsSidebarOpen(true)}
      />
      <main>
        <MainContent isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </main>
      
      {/* Modals */}
      {showFavorites && (
        <GenericModal title={t('myFavorites')} onClose={() => setShowFavorites(false)}>
          <FavoritesContent />
        </GenericModal>
      )}
      {showAbout && (
        <GenericModal title={t('aboutTourMate')} onClose={() => setShowAbout(false)}>
            <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>{t('aboutText')}</p>
                <p>Version: 1.0.0</p>
            </div>
        </GenericModal>
      )}
       {showSettings && (
        <GenericModal title={t('settings')} onClose={() => setShowSettings(false)}>
          <SettingsContent />
        </GenericModal>
      )}

      {/* Rafiqi AI Chat Button and Modal */}
       <button
        onClick={() => setShowRafiqi(true)}
        className="fixed bottom-6 left-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-30 transform hover:scale-110 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label={t('rafiqi')}
        style={{ left: language === 'ar' ? 'auto' : '1.5rem', right: language === 'ar' ? '1.5rem' : 'auto' }}
      >
        <Icon name="fa-solid fa-robot" className="text-2xl" />
      </button>

      {showRafiqi && <RafiqiModal onClose={() => setShowRafiqi(false)} />}
    </div>
  );
}

export default App;
