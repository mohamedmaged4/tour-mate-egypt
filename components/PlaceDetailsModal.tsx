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

const StarRating: React.FC<{ rating: number, className?: string }> = ({ rating, className = '' }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className={`flex text-amber-500 ${className}`}>
      {[...Array(fullStars)].map((_, i) => <Icon key={`full-${i}`} name="fa-solid fa-star" />)}
      {halfStar && <Icon name="fa-solid fa-star-half-alt" />}
      {[...Array(emptyStars)].map((_, i) => <Icon key={`empty-${i}`} name="fa-regular fa-star" />)}
    </div>
  );
};

/**
 * Renders a modal with detailed information about a specific place.
 * Includes an image slider, description, actions (maps, share, favorite), and text-to-speech.
 */
const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({ place, onClose }) => {
  const { language, isFavorite, addFavorite, removeFavorite, t, getReviewsForPlace, addReview } = useAppContext();
  const { speak, cancel, isPlaying } = useSpeech();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formState, setFormState] = useState({ author: '', rating: 0, comment: '' });
  const [formError, setFormError] = useState('');


  // Effect to stop speech when the modal is closed or the place changes
  useEffect(() => {
    return () => cancel();
  }, [place, cancel]);

  if (!place) return null;
  
  const placeReviews = getReviewsForPlace(place.id);
  const userRatingAverage = placeReviews.length > 0
      ? placeReviews.reduce((sum, r) => sum + r.rating, 0) / placeReviews.length
      : 0;

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

  const handleReviewSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formState.author.trim() || formState.rating === 0 || !formState.comment.trim()) {
          setFormError('Please fill out all fields.');
          return;
      }
      addReview(place.id, { author: formState.author, rating: formState.rating, comment: formState.comment });
      setFormState({ author: '', rating: 0, comment: '' });
      setFormError('');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormState(prev => ({...prev, [name]: value}));
  };

  const handleRatingChange = (newRating: number) => {
      setFormState(prev => ({...prev, rating: newRating}));
  };


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
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1">
              <Icon name="fa-solid fa-star" className="text-amber-500" />
              <span className="font-bold">{place.rating.toFixed(1)}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">({t('rating')})</span>
            </div>
            {userRatingAverage > 0 && (
              <>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                 <div className="flex items-center gap-1">
                  <StarRating rating={userRatingAverage} />
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                    ({userRatingAverage.toFixed(1)}) {t('basedOn')} {placeReviews.length} {placeReviews.length === 1 ? t('review') : t('reviewsPlural')}
                  </span>
                </div>
              </>
            )}
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
          
          {/* Reviews Section */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">{t('reviews')}</h3>
            
            {/* Add Review Form */}
            <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-lg mb-6">
              <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">{t('addReview')}</h4>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                 <input
                  type="text"
                  name="author"
                  value={formState.author}
                  onChange={handleFormChange}
                  placeholder={t('yourName')}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:ring-amber-500 focus:border-amber-500"
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('yourRating')}</label>
                  <div className="flex items-center gap-1 text-2xl text-slate-400">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleRatingChange(star)}
                        className={`transition-colors ${formState.rating >= star ? 'text-amber-500' : 'hover:text-amber-400'}`}
                        aria-label={`Rate ${star} star`}
                      >
                        <Icon name="fa-solid fa-star" />
                      </button>
                    ))}
                  </div>
                </div>
                 <textarea
                  name="comment"
                  value={formState.comment}
                  onChange={handleFormChange}
                  placeholder={t('yourComment')}
                  rows={3}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:ring-amber-500 focus:border-amber-500"
                />
                {formError && <p className="text-red-500 text-sm">{formError}</p>}
                <button type="submit" className="w-full bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors">
                  {t('submitReview')}
                </button>
              </form>
            </div>
            
            {/* Review List */}
            <div className="space-y-4">
              {placeReviews.length > 0 ? (
                placeReviews.map(review => (
                  <div key={review.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-slate-700 dark:text-slate-200">{review.author}</p>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{review.comment}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-right">
                      {new Date(review.timestamp).toLocaleDateString(language)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-center py-4">{t('noReviews')}</p>
              )}
            </div>
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