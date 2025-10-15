// types.ts

// Supported languages for the application
export type Language = 'en' | 'fr' | 'ar' | 'it' | 'de' | 'ru';

// Categories for places
export type Category = 'heritage' | 'restaurants' | 'cafes' | 'hotels';

// Type for multilingual strings
export interface LocalizedString {
  en: string;
  fr: string;
  ar: string;
  it: string;
  de: string;
  ru: string;
}

// Represents a single place of interest
export interface Place {
  id: string;
  name: LocalizedString;
  images: string[];
  shortDescription: LocalizedString;
  longDescription: LocalizedString;
  rating: number;
  averagePrice?: string;
  contactNumber?: string;
  googleMapsUrl: string;
}

// Represents all data for a specific governorate
export interface GovernorateData {
  id: string;
  name: LocalizedString;
  heritage: Place[];
  restaurants: Place[];
  cafes: Place[];
  hotels: Place[];
}

// Structure for the entire dataset of Egypt
export interface EgyptData {
  [key: string]: GovernorateData;
}

// Props for the Icon component
export interface IconProps {
  name: string;
  className?: string;
}

// Structure for translation strings used in the UI
export interface Translations {
  [lang: string]: {
    [key:string]: string;
  }
}
