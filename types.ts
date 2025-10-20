// types.ts

// Supported languages for the application
export type Language = 'en' | 'fr' | 'ar' | 'it' | 'de' | 'ru' | 'zh';

// Categories for places
export type Category = 'heritage' | 'restaurants' | 'cafes' | 'hotels';

// A single review for a place
export interface Review {
  id: string;
  placeId: string;
  author: string;
  rating: number; // 1 to 5
  comment: string;
  timestamp: number;
}

// Type for multilingual strings
export interface LocalizedString {
  en: string;
  fr: string;
  ar: string;
  it: string;
  de: string;
  ru: string;
  zh: string;
}

// Represents a single place of interest
export interface Place {
  id: string;
  name: LocalizedString;
  images: string[];
  shortDescription: LocalizedString;
  longDescription?: LocalizedString;
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

// Structure for a part of a chat message (can be text or image)
export interface ChatMessagePart {
  text?: string;
  imageUrl?: string;
  isLocal?: boolean; // To differentiate between local file URLs and remote URLs
}

// Structure for a single chat message
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  parts: ChatMessagePart[];
  timestamp: number;
  isTyping?: boolean; // for model's response placeholder
}
