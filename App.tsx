
// App.tsx

import React, { useState } from 'react';
import { useAppContext } from './contexts';
import WelcomeScreen from './components/WelcomeScreen';
import Navbar from './components/Navbar';
import MainContent from './components/MainContent';
import { Place } from './types';
import Icon from './components/Icon';

/**
 * A generic modal component for displaying content like 'About' or 'Favorites'.
 */
const GenericModal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
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
 * The main App component. It acts as a router, displaying the WelcomeScreen
 * if no governorate is selected, or the main application interface otherwise.
 * It also manages the visibility of the About and Favorites modals.
 */
function App() {
  const { governorate, t } = useAppContext();
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Conditional rendering based on whether a governorate has been selected.
  if (!governorate) {
    return <WelcomeScreen />;
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-900">
      <Navbar 
        onFavoritesClick={() => setShowFavorites(true)}
        onAboutClick={() => setShowAbout(true)}
      />
      <main>
        <MainContent />
      </main>
      
      {showFavorites && (
        <GenericModal title={t('myFavorites')} onClose={() => setShowFavorites(false)}>
          <FavoritesContent />
        </GenericModal>
      )}

      {showAbout && (
        <GenericModal title={t('aboutTourMate')} onClose={() => setShowAbout(false)}>
          <div className="space-y-4 text-slate-600 dark:text-slate-300">
             <p>{t('aboutText')}</p>
          </div>
        </GenericModal>
      )}
    </div>
  );
}

export default App;
