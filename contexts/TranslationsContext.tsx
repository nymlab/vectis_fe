import React from "react";
import locales from "../locales";
import * as localStorage from "services/localStorage";

type ITranslations = {
  [key: string]: string;
};

interface TranslationsContext {
  t: (key: string) => string;
  language: string;
  setLanguage: (language: string) => void;
  translations: ITranslations | undefined;
}

const SUPPORTED_LANGUAGES = ["en", "es", "it"];

const TranslationsContext = React.createContext<TranslationsContext | null>(null);

const TranslationsProvider: React.FC<{ debug?: boolean }> = ({ children, debug }) => {
  const [language, setLanguage] = React.useState<string>("en");
  const [translations, setTranslations] = React.useState<ITranslations>(locales[language]);

  const getTranslation = React.useCallback((k: string) => (debug ? k : translations[k] || ""), [translations, debug]);
  const handlerSetLanguage = React.useCallback((l: string) => (SUPPORTED_LANGUAGES.includes(l) ? l : "en"), []);

  React.useEffect(() => {
    const BROWSER_LANGUAGE = window?.navigator?.language?.slice(0, 2);
    const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.includes(BROWSER_LANGUAGE) ? BROWSER_LANGUAGE : "en";
    setLanguage(localStorage.getLanguage() || DEFAULT_LANGUAGE);
  }, []);

  React.useEffect(() => {
    localStorage.setLanguage(language);
    setTranslations(locales[language]);
  }, [language, debug]);

  return (
    <TranslationsContext.Provider value={{ setLanguage: handlerSetLanguage, language, t: getTranslation, translations }}>
      {children}
    </TranslationsContext.Provider>
  );
};

export const useTranslations = () => {
  const context = React.useContext(TranslationsContext);
  if (!context) throw new Error("TranslationsContext used outside of TranslationsProvider");
  return context;
};

export default TranslationsProvider;
