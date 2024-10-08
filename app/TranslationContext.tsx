"use client";

// used to translate
import React, { createContext, useContext, useState } from 'react';
import translations from '@/app/data/translations.json';

export interface Translations {
    [key: string]: string | string[];
}

export interface AllTranslations {
    en: Translations;
    de: Translations;
}

export type Language = 'en' | 'de';

interface TranslationContextProps {
    language: Language;
    translate: (key: string, joinArray?: boolean, delimiter?: string) => string;
    setLanguage: (language: Language) => void;
}

const TranslationContext = createContext<TranslationContextProps | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('de');

    const translate = (key: string, joinArray: boolean = true, delimiter: string = ', '): string => {
        const langTranslations: Translations = translations[language as keyof AllTranslations];
        const translation = langTranslations[key];

        if (Array.isArray(translation)) {
            return translation.join(delimiter);
        }

        return translation || key;
    };

    return (
        <TranslationContext.Provider value={{ language, translate, setLanguage }}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
};
