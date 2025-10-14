
// components/MainContent.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { EGYPT_DATA } from '../data';
import { useAppContext } from '../contexts';
import { Category, Place } from '../types';
import Icon from './Icon';
import PlaceDetailsModal from './PlaceDetailsModal';

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

/**
 * Represents a single card for a place in the list.
 */
const PlaceCard: React.FC<{ place: Place; onSelect: (place: Place) => void }> = ({ place, onSelect }) => {
  const { language, t } = useAppContext();
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
      <img className="h-48 w-full object-cover" src={place.images[0]} alt={place.name[language]} />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-amber-800 dark:text-amber-300">{place.name[language]}</h3>
            <div className="flex-shrink-0 flex items-center gap-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full text-sm">
                <Icon name="fa-solid fa-star" />
                <span>{place.rating.toFixed(1)}</span>
            </div>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-grow">{place.shortDescription[language]}</p>
        <button 
          onClick={() => onSelect(place)}
          className="mt-auto w-full bg-amber-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
        >
          {t('viewDetails')}
        </button>
      </div>
    </div>
  );
};


/**
 * The main component that displays the tabbed interface, search functionality,
 * and the grid of places for the selected governorate and category.
 */
const MainContent: React.FC = () => {
  const { governorate, language, t } = useAppContext();
  const [activeTab, setActiveTab] = useState<Category>('heritage');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [shuffledPlaces, setShuffledPlaces] = useState<Place[]>([]);

  const governorateData = governorate ? EGYPT_DATA[governorate] : null;

  // Effect to shuffle places when tab or governorate changes
  useEffect(() => {
    if (governorateData) {
      const placesForTab = governorateData[activeTab].slice(0, 10); // Get first 10
      setShuffledPlaces(shuffleArray(placesForTab));
    }
  }, [activeTab, governorateData]);

  // Filter places based on search term
  const filteredPlaces = useMemo(() => {
    if (!searchTerm) {
      return shuffledPlaces;
    }
    return shuffledPlaces.filter(place =>
      place.name[language].toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, shuffledPlaces, language]);
  
  if (!governorateData) {
    return <div className="text-center p-8 text-slate-500">{t('selectGovernorate')}</div>;
  }

  const tabs: { key: Category; label: string; icon: string }[] = [
    { key: 'heritage', label: t('heritageSites'), icon: 'fa-solid fa-landmark-dome' },
    { key: 'restaurants', label: t('restaurants'), icon: 'fa-solid fa-utensils' },
    { key: 'cafes', label: t('cafes'), icon: 'fa-solid fa-mug-saucer' },
    { key: 'hotels', label: t('hotels'), icon: 'fa-solid fa-hotel' },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">{governorateData.name[language]}</h1>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-slate-300 dark:border-slate-700">
        <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap flex items-center gap-2 py-3 px-4 border-b-4 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <Icon name={tab.icon} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <input
          type="text"
          placeholder={`${t('searchPlaceholder')} (${filteredPlaces.length})`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 pl-12 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon name="fa-solid fa-search" />
        </div>
      </div>

      {/* Places Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map(place => (
            <PlaceCard key={place.id} place={place} onSelect={setSelectedPlace} />
          ))
        ) : (
          <p className="text-slate-500 col-span-full text-center py-8">{t('noResults')}</p>
        )}
      </div>

      {/* Details Modal */}
      {selectedPlace && <PlaceDetailsModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />}
    </div>
  );
};


export default MainContent;
