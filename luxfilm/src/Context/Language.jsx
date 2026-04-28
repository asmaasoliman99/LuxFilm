import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n, t: i18nTranslate } = useTranslation();

  const lang = i18n.language ? i18n.language.split('-')[0] : 'en';

  const setLang = (newLang) => {
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const getTMDBLang = useCallback(() => {
    return lang === 'ar' ? 'ar-SA' : 'en-US';
  }, [lang]);

  const t = (key, options) => {
    // Support both old (arText, enText) and new (translationKey) usage
    if (typeof key === 'string' && typeof options === 'string') {
      return lang === 'ar' ? key : options;
    }
    return i18nTranslate(key, options);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, getTMDBLang, t, i18n }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};