"use client";

import { createContext, useContext, ReactNode, createElement } from 'react';

// NOTE: This could be typed more strictly based on your JSON structure
type Dictionary = { [key: string]: any };

const I18nContext = createContext<Dictionary | null>(null);

export function I18nProvider({ children, dictionary }: { children: ReactNode, dictionary: Dictionary }) {
  // FIX: Replaced JSX with React.createElement to avoid parsing errors in a .ts file.
  return createElement(I18nContext.Provider, { value: dictionary }, children);
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === null) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}