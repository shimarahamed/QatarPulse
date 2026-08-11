export type Lang = 'en' | 'ar';

/** Picks the field matching the given language, falling back to English. */
export function pickLocalizedValue(lang: Lang, enValue: string, arValue: string | undefined) {
  if (lang === 'ar' && arValue) return arValue;
  return enValue;
}
