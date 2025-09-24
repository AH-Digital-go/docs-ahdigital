import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Type definitions
interface LanguageConfig {
  name: string;
  flag: string;
  native: string;
}

interface GoogleTranslateConfig {
  languages: Record<string, LanguageConfig>;
}

// Extend Window interface for Google Translate
declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (options: any, elementId: string) => void;
        TranslateService: () => {
          translatePage: (from: string, to: string, callback?: () => void) => void;
        };
      };
    };
    googleTranslateElementInit: () => void;
  }
}

// Google Translate Configuration
const GOOGLE_TRANSLATE_CONFIG: GoogleTranslateConfig = {
  languages: {
    en: { name: 'English', flag: '🇬🇧', native: 'English' },
    ar: { name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
    fr: { name: 'French', flag: '🇫🇷', native: 'Français' }
  }
};

// Google Translate Service
class GoogleTranslateService {
  private isLoaded: boolean = false;
  private translateElement: any = null;

  // Initialize Google Translate
  async initializeGoogleTranslate(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Set up the callback function globally
      window.googleTranslateElementInit = () => {
        try {
          this.translateElement = new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,ar,fr',
            layout: 'SIMPLE',
            autoDisplay: false
          }, 'google_translate_element');
          
          this.isLoaded = true;
          this.hideGoogleUI();
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      // Load the Google Translate script
      if (!document.querySelector('script[src*="translate.google.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        script.onerror = () => reject(new Error('Failed to load Google Translate'));
        document.head.appendChild(script);
      } else if (window.google && window.google.translate) {
        window.googleTranslateElementInit();
      }
    });
  }

  // Hide Google's default UI
  private hideGoogleUI(): void {
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-banner-frame { display: none !important; }
      .goog-te-menu-value { color: inherit !important; }
      body { top: 0 !important; position: static !important; }
      #google_translate_element { display: none !important; }
      .goog-te-combo { display: none !important; }
      .skiptranslate { display: none !important; }
    `;
    document.head.appendChild(style);
  }

  // Trigger translation programmatically
  translateTo(langCode: string): boolean {
    if (!this.isLoaded) return false;

    // Method 1: Try using the combo box
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }

    // Method 2: Try using Google Translate's internal method
    if (window.google && window.google.translate && window.google.translate.TranslateService) {
      try {
        window.google.translate.TranslateService().translatePage('en', langCode, () => {
          console.log(`Translated to ${langCode}`);
        });
        return true;
      } catch (e) {
        console.error('Translation error:', e);
      }
    }

    // Method 3: Manipulate the URL hash (fallback)
    if (langCode === 'en') {
      // Reset to original
      window.location.hash = '';
      window.location.reload();
    } else {
      window.location.hash = `#googtrans(en|${langCode})`;
      window.location.reload();
    }
    
    return true;
  }

  // Get current language
  getCurrentLanguage(): string {
    // Check URL hash first
    const hash = window.location.hash;
    const hashMatch = hash.match(/#googtrans\(en\|(\w+)\)/);
    if (hashMatch) return hashMatch[1];

    // Check localStorage
    const stored = localStorage.getItem('googtrans');
    if (stored) {
      const match = stored.match(/\/en\/(\w+)/);
      if (match) return match[1];
    }

    return 'en';
  }
}

// Google Translate Component
const GoogleTranslateButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [translateService] = useState<GoogleTranslateService>(() => new GoogleTranslateService());

  useEffect(() => {
    const initTranslate = async (): Promise<void> => {
      try {
        await translateService.initializeGoogleTranslate();
        setIsReady(true);
        
        // Get current language
        const currentLanguage = translateService.getCurrentLanguage();
        setCurrentLang(currentLanguage);
        
        // Set document direction
        document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = currentLanguage;
        
      } catch (error) {
        console.error('Failed to initialize Google Translate:', error);
      }
    };

    initTranslate();
  }, [translateService]);

  const handleLanguageChange = (langCode: string): void => {
    if (langCode === currentLang || !isReady) return;

    setIsLoading(true);
    
    try {
      const success = translateService.translateTo(langCode);
      
      if (success) {
        setCurrentLang(langCode);
        
        // Update document properties
        document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = langCode;
        
        // Update page title
        const titles: Record<string, string> = {
          en: 'Your App Title',
          ar: 'عنوان التطبيق الخاص بك',
          fr: 'Le titre de votre application'
        };
        
        setTimeout(() => {
          if (titles[langCode]) {
            document.title = titles[langCode];
          }
        }, 1000);
      }
      
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  const togglePanel = (): void => {
    setIsVisible(!isVisible);
  };

  const toggleGoogleWidget = (): void => {
    const element = document.getElementById('google_translate_element');
    if (element) {
      element.style.display = element.style.display === 'block' ? 'none' : 'block';
    }
  };

  return (
    <div className="fixed right-4 top-20 z-50 flex flex-col items-end">
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element"></div>
      
      {isVisible ? (
        <>
          {/* Language Switcher Panel */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 flex flex-col gap-2 min-w-[160px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <span>🌐</span>
                <span>Translate</span>
              </span>
              <button
                onClick={togglePanel}
                className="text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                aria-label="Close translation panel"
                type="button"
              >
                ✕
              </button>
            </div>
            
            {!isReady && (
              <div className="text-xs text-gray-500 dark:text-gray-400 p-2 text-center">
                Loading translator...
              </div>
            )}
            
            {isReady && Object.entries(GOOGLE_TRANSLATE_CONFIG.languages).map(([code, lang]) => (
              <button 
                key={code}
                onClick={() => handleLanguageChange(code)}
                disabled={isLoading}
                type="button"
                className={`px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-all duration-200 ${
                  currentLang === code 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.native}</span>
                {currentLang === code && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </button>
            ))}

            {/* Manual Translation Button */}
            <div className="border-t pt-2 mt-1">
              <button
                onClick={toggleGoogleWidget}
                type="button"
                className="w-full text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
              >
                Show Google Widget
              </button>
            </div>

            {/* Powered by Google */}
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Powered by Google Translate
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mt-2 flex items-center text-blue-700 dark:text-blue-300">
              <svg 
                className="animate-spin h-4 w-4 mr-2" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-sm">Translating...</span>
            </div>
          )}

          {/* Current Language Display */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 mt-2 text-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Current: {GOOGLE_TRANSLATE_CONFIG.languages[currentLang]?.native || 'English'}
            </span>
          </div>
        </>
      ) : (
        <button
          onClick={togglePanel}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:scale-110 transition-all duration-200"
          aria-label="Open translator"
          title="Translate Page"
          type="button"
        >
          <span className="text-xl">🌐</span>
        </button>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Google Translate Button */}
        <GoogleTranslateButton />
        
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;