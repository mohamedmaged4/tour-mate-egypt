// components/RafiqiModal.tsx

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useAppContext } from '../contexts';
import { ChatMessage, ChatMessagePart } from '../types';
import Icon from './Icon';

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve({ mimeType: file.type, data: base64Data });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// SpeechRecognition API type declaration
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const RafiqiModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t, language } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputImage, setInputImage] = useState<{ file: File; url: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  // Add initial welcome message from the AI
  useEffect(() => {
    setMessages([
      {
        id: `rafiqi-welcome-${Date.now()}`,
        role: 'model',
        parts: [{ text: t('rafiqiWelcome') }],
        timestamp: Date.now(),
      }
    ]);
  }, [t]);

  // Effect for scrolling to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Effect for cleaning up speech recognition
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSend = async () => {
    if ((!inputValue.trim() && !inputImage) || isLoading) return;

    const userParts: ChatMessagePart[] = [];
    if (inputValue.trim()) {
        userParts.push({ text: inputValue.trim() });
    }
    if (inputImage) {
        userParts.push({ imageUrl: inputImage.url, isLocal: true });
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      parts: userParts,
      timestamp: Date.now(),
    };
    
    // Add user message and typing indicator
    setMessages(prev => [...prev, userMessage, {
        id: `model-typing-${Date.now()}`,
        role: 'model',
        parts: [],
        timestamp: Date.now(),
        isTyping: true,
    }]);

    const currentInputValue = inputValue;
    const currentInputImage = inputImage;
    setInputValue('');
    setInputImage(null);
    setIsLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        const geminiParts: any[] = [];
        if (currentInputValue.trim()) {
            geminiParts.push({ text: currentInputValue.trim() });
        }
        if (currentInputImage) {
            const { mimeType, data } = await fileToBase64(currentInputImage.file);
            geminiParts.push({ inlineData: { mimeType, data } });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: geminiParts }
        });

        const modelResponse: ChatMessage = {
            id: `model-${Date.now()}`,
            role: 'model',
            parts: [{ text: response.text }],
            timestamp: Date.now(),
        };

        // Replace typing indicator with the actual response
        setMessages(prev => [...prev.slice(0, -1), modelResponse]);

    } catch (error) {
        console.error("Gemini API error:", error);
        const errorMessage: ChatMessage = {
            id: `model-error-${Date.now()}`,
            role: 'model',
            parts: [{ text: "Sorry, I encountered an error. Please try again." }],
            timestamp: Date.now(),
        };
        setMessages(prev => [...prev.slice(0, -1), errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleAttachImage = () => {
      fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 4 * 1024 * 1024) { // 4MB limit
              alert(t('imageUploadError'));
              return;
          }
          setInputImage({ file, url: URL.createObjectURL(file) });
      }
  };

  const toggleListen = () => {
      if (isListening) {
          recognitionRef.current?.stop();
          setIsListening(false);
      } else {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (!SpeechRecognition) {
              alert("Sorry, your browser doesn't support speech recognition.");
              return;
          }
          
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.lang = language;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.continuous = true;

          recognitionRef.current.onstart = () => setIsListening(true);
          recognitionRef.current.onend = () => setIsListening(false);
          recognitionRef.current.onerror = (event: any) => {
              console.error('Speech recognition error', event.error);
              setIsListening(false);
          };

          let finalTranscript = '';
          recognitionRef.current.onresult = (event: any) => {
              let interimTranscript = '';
              for (let i = event.resultIndex; i < event.results.length; ++i) {
                  if (event.results[i].isFinal) {
                      finalTranscript += event.results[i][0].transcript;
                  } else {
                      interimTranscript += event.results[i][0].transcript;
                  }
              }
              setInputValue(finalTranscript + interimTranscript);
          };
          
          recognitionRef.current.start();
      }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl h-[85vh] flex flex-col animate-slide-up" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Icon name="fa-solid fa-robot" className="text-2xl text-amber-600 dark:text-amber-400" />
            <h2 className="text-xl font-bold text-amber-800 dark:text-amber-300">{t('rafiqi')}</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white">
            <Icon name="fa-solid fa-times" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map(msg => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0"><Icon name="fa-solid fa-robot" className="text-amber-600 dark:text-amber-400"/></div>}
                    <div className={`max-w-md md:max-w-lg p-3 rounded-xl ${msg.role === 'user' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
                        {msg.isTyping ? (
                            <div className="flex items-center gap-1.5">
                                <span className="typing-dot"></span>
                                <span className="typing-dot" style={{ animationDelay: '0.2s' }}></span>
                                <span className="typing-dot" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        ) : (
                            msg.parts.map((part, index) => (
                                <div key={index}>
                                    {part.text && <p className="whitespace-pre-wrap">{part.text}</p>}
                                    {part.imageUrl && <img src={part.imageUrl} alt="User upload" className="mt-2 rounded-lg max-w-xs"/>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t dark:border-slate-700 flex-shrink-0">
          {inputImage && (
              <div className="mb-2 relative w-24">
                  <img src={inputImage.url} alt="Preview" className="w-24 h-24 object-cover rounded-md" />
                  <button onClick={() => setInputImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      <Icon name="fa-solid fa-times" />
                  </button>
              </div>
          )}
          <div className="flex items-center gap-2">
              <button onClick={handleAttachImage} className="chat-icon-button" aria-label={t('attachImage')}>
                  <Icon name="fa-solid fa-paperclip" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden"/>
              
              <button onClick={toggleListen} className={`chat-icon-button ${isListening ? 'text-red-500' : ''}`} aria-label={isListening ? t('stopSpeaking') : t('startSpeaking')}>
                  <Icon name="fa-solid fa-microphone" />
              </button>
              
              <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                      }
                  }}
                  placeholder={isListening ? t('listening') : t('askRafiqi')}
                  className="flex-grow p-2.5 bg-slate-100 dark:bg-slate-700 rounded-lg resize-none border-2 border-transparent focus:border-amber-500 focus:ring-0 focus:outline-none"
                  rows={1}
              />
              <button onClick={handleSend} disabled={isLoading || (!inputValue.trim() && !inputImage)} className="bg-amber-500 text-white font-bold w-11 h-11 rounded-lg flex items-center justify-center hover:bg-amber-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                  {isLoading ? <div className="loader"></div> : <Icon name="fa-solid fa-paper-plane" />}
              </button>
          </div>
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
        .chat-icon-button {
            @apply h-11 w-11 flex-shrink-0 flex items-center justify-center text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors;
        }
        .loader {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #amber-500;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes typing-bubble {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
        }
        .typing-dot {
            width: 6px;
            height: 6px;
            background-color: #94a3b8;
            border-radius: 50%;
            animation: typing-bubble 1s infinite ease-in-out;
        }
        textarea {
            scrollbar-width: none; /* Firefox */
        }
        textarea::-webkit-scrollbar {
            display: none; /* Safari and Chrome */
        }
      `}</style>
    </div>
  );
};

export default RafiqiModal;
