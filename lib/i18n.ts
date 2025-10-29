import 'server-only'

const dictionaries = {
  'en': () => import('@/i18n/en.json').then((module) => module.default),
  'de-CH': () => import('@/i18n/de-CH.json').then((module) => module.default),
  'nl': () => import('@/i18n/nl.json').then((module) => module.default),
}

type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: string) => {
  const validLocale = locale in dictionaries ? (locale as Locale) : 'de-CH';
  return dictionaries[validLocale]();
}
