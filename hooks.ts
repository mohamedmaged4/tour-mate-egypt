// hooks.ts

import { useState, useEffect, useCallback } from 'react';
import { Language } from './types';

/**
 * A custom hook to synchronize state with localStorage.
 * It's generic and can handle any data type that is serializable.
 * @param key The key to use in localStorage.
 * @param initialValue The initial value to use if nothing is in localStorage.
 * @returns A stateful value, and a function to update it.
 */
export function useLocalStorage<T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [storedValue, setValue];
}


/**
 * A custom hook for Text-to-Speech functionality.
 * Manages speech synthesis, voice selection, and playback state.
 * @returns An object with speech control functions and state.
 */
export const useSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load voices when they become available
  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  /**
   * Speaks the given text using a selected voice.
   * @param text The text to be spoken.
   * @param lang The language of the text.
   * @param gender The desired voice gender ('male' or 'female').
   */
  const speak = useCallback((text: string, lang: Language, gender: 'male' | 'female') => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map app language to speech synthesis language codes
    const langCode = {
      en: 'en-US',
      fr: 'fr-FR',
      ar: 'ar-SA',
      it: 'it-IT',
      de: 'de-DE',
      ru: 'ru-RU',
    }[lang];

    utterance.lang = langCode;

    // Find a suitable voice
    const potentialVoices = voices.filter(v => v.lang.startsWith(langCode.split('-')[0]));
    let selectedVoice = null;

    if(gender === 'female') {
      selectedVoice = potentialVoices.find(v => v.name.toLowerCase().includes('female')) || potentialVoices[0];
    } else {
       selectedVoice = potentialVoices.find(v => v.name.toLowerCase().includes('male')) || potentialVoices.find(v => !v.name.toLowerCase().includes('female')) || potentialVoices[0];
    }

    if(selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  }, [voices]);
  
  // Stops any ongoing speech
  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  return { speak, cancel, isPlaying };
};
