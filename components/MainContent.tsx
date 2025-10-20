// components/MainContent.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
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
  const isAiGenerated = place.id.startsWith('ai-');
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col relative">
      {isAiGenerated && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 flex items-center gap-1">
              <Icon name="fa-solid fa-wand-magic-sparkles" className="text-xs" />
              <span>AI</span>
          </div>
      )}
      <img className="h-48 w-full object-cover" src={place.images[0]} alt={place.name[language]} />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-amber-800 dark:text-amber-300 pr-2">{place.name[language]}</h3>
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

const SkeletonCard: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
        <div className="bg-slate-300 dark:bg-slate-700 h-48 w-full"></div>
        <div className="p-4">
            <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full mb-1"></div>
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-5/6 mb-4"></div>
            <div className="h-10 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
        </div>
    </div>
);

interface MainContentProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

/**
 * The main component that displays the search functionality,
 * and the grid of places for the selected governorate and category.
 * It now features a sidebar for category selection instead of tabs.
 */
const MainContent: React.FC<MainContentProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { governorate, language, t } = useAppContext();
  const [activeTab, setActiveTab] = useState<Category>('heritage');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  
  const [curatedPlaces, setCuratedPlaces] = useState<Place[]>([]);
  const [aiPlaces, setAiPlaces] = useState<Place[]>([]);
  const [isLoadingAiPlaces, setIsLoadingAiPlaces] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const governorateData = governorate ? EGYPT_DATA[governorate] : null;

  // Effect to set curated places when tab or governorate changes
  useEffect(() => {
    if (governorateData) {
      const placesForTab = governorateData[activeTab];
      setCuratedPlaces(shuffleArray(placesForTab));
      // Reset AI places when tab changes
      setAiPlaces([]);
      setAiError(null);
    }
  }, [activeTab, governorateData]);

  // Filter places based on search term
  const allPlaces = useMemo(() => [...curatedPlaces, ...aiPlaces], [curatedPlaces, aiPlaces]);

  const filteredPlaces = useMemo(() => {
    if (!searchTerm) {
      return allPlaces;
    }
    return allPlaces.filter(place =>
      place.name[language].toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allPlaces, language]);

  const handleFetchAiPlaces = async () => {
    if (!governorateData) return;
    setIsLoadingAiPlaces(true);
    setAiError(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        const localizedStringSchema = {
            type: Type.OBJECT,
            properties: {
                en: { type: Type.STRING },
                fr: { type: Type.STRING },
                ar: { type: Type.STRING },
                it: { type: Type.STRING },
                de: { type: Type.STRING },
                ru: { type: Type.STRING },
                zh: { type: Type.STRING },
            },
            required: ['en', 'fr', 'ar', 'it', 'de', 'ru', 'zh'],
        };

        const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { ...localizedStringSchema, description: "The name of the place, translated into all specified languages." },
                    shortDescription: { ...localizedStringSchema, description: "A brief, one-sentence description, translated into all specified languages." },
                    longDescription: { ...localizedStringSchema, description: "A detailed, paragraph-long description, translated into all specified languages." },
                    rating: { type: Type.NUMBER, description: "A realistic rating out of 5, e.g., 4.5" },
                },
                required: ["name", "shortDescription", "longDescription", "rating"],
            },
        };

        const prompt = `You are an expert tour guide for Egypt. Generate a list of exactly 4 popular and interesting ${activeTab} located ONLY within the ${governorateData.name.en} governorate of Egypt. These places must be different from this existing list: ${curatedPlaces.map(p => p.name.en).join(', ')}.

        For each place, provide the following details in a JSON object:
        1.  'name': An object containing the place's name, translated into English (en), French (fr), Arabic (ar), Italian (it), German (de), Russian (ru), and Chinese (zh).
        2.  'shortDescription': An object containing a brief, one-sentence description, translated into all the languages listed above.
        3.  'longDescription': An object containing a detailed, paragraph-long description, translated into all the languages listed above.
        4.  'rating': A realistic rating out of 5 (e.g., 4.5).

        Return the response as a JSON array that conforms to the provided schema.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: schema }
        });

        const generatedData = JSON.parse(response.text);

        const newPlaces: Place[] = generatedData.map((item: any, index: number) => {
            const placeholderImageId = 100 + (Math.floor(Math.random() * 100));
            return {
                id: `ai-${activeTab}-${governorate}-${Date.now()}-${index}`,
                name: item.name,
                shortDescription: item.shortDescription,
                longDescription: item.longDescription,
                images: [`https://images.picsum.photos/id/${placeholderImageId}/1024/768.jpg`],
                rating: Math.max(3.5, Math.min(5, item.rating)),
                googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name.en}, ${governorateData.name.en}, Egypt`)}`,
            };
        });
        setAiPlaces(prev => [...prev, ...newPlaces]);

    } catch (error) {
        console.error("Error fetching AI places:", error);
        setAiError(t('aiError'));
    } finally {
        setIsLoadingAiPlaces(false);
    }
  };
  
  if (!governorateData) {
    return <div className="text-center p-8 text-slate-500">{t('selectGovernorate')}</div>;
  }

  const tabs: { key: Category; label: string; icon: string }[] = [
    { key: 'heritage', label: t('heritageSites'), icon: 'fa-solid fa-landmark-dome' },
    { key: 'restaurants', label: t('restaurants'), icon: 'fa-solid fa-utensils' },
    { key: 'cafes', label: t('cafes'), icon: 'fa-solid fa-mug-saucer' },
    { key: 'hotels', label: t('hotels'), icon: 'fa-solid fa-hotel' },
  ];

  const handleTabChange = (tabKey: Category) => {
    setActiveTab(tabKey);
    setIsSidebarOpen(false);
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">{governorateData.name[language]}</h1>
        <h2 className="text-xl font-semibold text-amber-600 dark:text-amber-400 mb-4">
          {tabs.find(tab => tab.key === activeTab)?.label}
        </h2>
        
        {/* Search Bar */}
        <div className="mb-6 relative">
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
      
        {/* AI Discovery Button */}
        <div className="mb-8 text-center">
          <button
            onClick={handleFetchAiPlaces}
            disabled={isLoadingAiPlaces}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-wait"
          >
            <Icon name="fa-solid fa-wand-magic-sparkles" className="mr-2" />
            {isLoadingAiPlaces ? t('discovering') : t('discoverMore')}
          </button>
          {aiError && <p className="text-red-500 mt-2 text-sm">{aiError}</p>}
        </div>


        {/* Places Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map(place => (
              <PlaceCard key={place.id} place={place} onSelect={setSelectedPlace} />
            ))
          ) : (
            !isLoadingAiPlaces && <p className="text-slate-500 col-span-full text-center py-8">{t('noResults')}</p>
          )}
          {isLoadingAiPlaces && (
              [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
          )}
        </div>

        {/* Details Modal */}
        {selectedPlace && <PlaceDetailsModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />}
      </div>
      
      {/* Sidebar Navigation */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden={!isSidebarOpen}
      ></div>

      <div 
        role="dialog"
        aria-modal="true"
        aria-label={t('categories')}
        className={`fixed top-0 ${language === 'ar' ? 'right-0' : 'left-0'} h-full w-72 bg-white dark:bg-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : (language === 'ar' ? 'translate-x-full' : '-translate-x-full')}`}>
        <div className="p-5">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-300">{t('categories')}</h2>
                 <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white" aria-label={t('close')}>
                    <Icon name="fa-solid fa-times" />
                </button>
            </div>
            <nav className="flex flex-col space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`w-full text-start flex items-center gap-4 p-3 rounded-lg font-semibold text-lg transition-colors ${
                  activeTab === tab.key
                    ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon name={tab.icon} className="w-6 text-center text-amber-600 dark:text-amber-400" />
                <span>{tab.label}</span>
              </button>
            ))}
            </nav>
        </div>
      </div>
    </>
  );
};


export default MainContent;
