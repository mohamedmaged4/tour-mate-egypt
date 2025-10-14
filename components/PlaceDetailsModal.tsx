
// components/PlaceDetailsModal.tsx

import React, { useState, useEffect } from 'react';
import { Place } from '../types';
import { useAppContext } from '../contexts';
import { useSpeech } from '../hooks';
import Icon from './Icon';

interface PlaceDetailsModalProps {
  place: Place | null;
  onClose: () => void;
}

/**
 * Renders a modal with detailed information about a specific place.
 * Includes an image slider, description, actions (maps, share, favorite), and text-to-speech.
 */
const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({ place, onClose }) => {
  const { language, isFavorite, addFavorite, removeFavorite, t } = useAppContext();
  const { speak, cancel, isPlaying } = useSpeech();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Effect to stop speech when the modal is closed or the place changes
  useEffect(() => {
    return () => cancel();
  }, [place, cancel]);

  if (!place) return null;

  const handleFavoriteClick = () => {
    if (isFavorite(place.id)) {
      removeFavorite(place.id);
    } else {
      addFavorite(place);
    }
  };
  
  const handleShare = () => {
    if(navigator.share) {
      navigator.share({
        title: place.name[language],
        text: place.shortDescription[language],
        url: window.location.href,
      }).catch(error => console.log('Error sharing:', error));
    }
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % place.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + place.images.length) % place.images.length);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative transform transition-transform duration-300 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 z-10">
          <Icon name="fa-solid fa-times" className="text-2xl" />
        </button>

        {/* Image Slider */}
        <div className="relative w-full h-64 md:h-96">
          <img src={place.images[currentImageIndex]} alt={place.name[language]} className="w-full h-full object-cover rounded-t-2xl"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          {place.images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-2 hover:bg-black/60 transition-colors">
                <Icon name="fa-solid fa-chevron-left"/>
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-2 hover:bg-black/60 transition-colors">
                <Icon name="fa-solid fa-chevron-right"/>
              </button>
            </>
          )}
          <h2 className="absolute bottom-4 left-4 text-white text-3xl md:text-4xl font-bold">{place.name[language]}</h2>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-4 mb-4 text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1">
              <Icon name="fa-solid fa-star" className="text-amber-500" />
              <span className="font-bold">{place.rating.toFixed(1)}</span>
            </div>
            {place.averagePrice && (
              <>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <div className="flex items-center gap-1">
                  <Icon name="fa-solid fa-money-bill-wave" className="text-green-500" />
                  <span>{place.averagePrice}</span>
                </div>
              </>
            )}
            {place.contactNumber && (
              <>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <div className="flex items-center gap-1">
                  <Icon name="fa-solid fa-phone" className="text-blue-500" />
                  <a href={`tel:${place.contactNumber}`} className="hover:underline">{place.contactNumber}</a>
                </div>
              </>
            )}
          </div>

          <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">{place.longDescription[language]}</p>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Listen to description */}
            <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg flex flex-col items-center justify-center gap-2">
                <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">{t('listenDescription')}</p>
                <div className="flex gap-2">
                    <button onClick={() => speak(place.longDescription[language], language, 'female')} className={`px-3 py-1 rounded-md text-sm ${isPlaying ? 'bg-amber-200 dark:bg-amber-800' : 'bg-slate-200 dark:bg-slate-600'} hover:bg-amber-300 dark:hover:bg-amber-700 transition-colors`}>
                        <Icon name="fa-solid fa-female" /> {t('femaleVoice')}
                    </button>
                    <button onClick={() => speak(place.longDescription[language], language, 'male')} className={`px-3 py-1 rounded-md text-sm ${isPlaying ? 'bg-amber-200 dark:bg-amber-800' : 'bg-slate-200 dark:bg-slate-600'} hover:bg-amber-300 dark:hover:bg-amber-700 transition-colors`}>
                        <Icon name="fa-solid fa-male" /> {t('maleVoice')}
                    </button>
                    {isPlaying && <button onClick={cancel} className="px-3 py-1 rounded-md text-sm bg-red-500 text-white"><Icon name="fa-solid fa-stop"/></button>}
                </div>
            </div>

            {/* Other actions */}
            <a href={place.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="action-button bg-blue-500 hover:bg-blue-600">
              <Icon name="fa-solid fa-map-location-dot" />
              <span>{t('getDirections')}</span>
            </a>
            <button onClick={handleFavoriteClick} className={`action-button ${isFavorite(place.id) ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'}`}>
              <Icon name={`fa-solid fa-heart ${isFavorite(place.id) ? '' : ''}`} />
              <span>{isFavorite(place.id) ? t('removeFromFavorites') : t('addToFavorites')}</span>
            </button>
            <button onClick={handleShare} className="action-button bg-green-500 hover:bg-green-600">
              <Icon name="fa-solid fa-share-alt" />
              <span>{t('share')}</span>
            </button>
          </div>
        </div>
      </div>
       <style>{`
          .action-button {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem;
            color: white;
            font-weight: bold;
            border-radius: 0.5rem;
            transition: background-color 0.2s;
            text-align: center;
          }
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
};

export default PlaceDetailsModal;
