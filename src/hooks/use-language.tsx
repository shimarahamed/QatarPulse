'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { doc } from 'firebase/firestore';
import { useFirebase, setDocumentNonBlocking } from '@/firebase';
import { pickLocalizedValue, type Lang } from '@/lib/localize';

export type { Lang };

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'qp_lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  const { firestore, user, userProfile } = useFirebase();

  // Load preference on mount: signed-in users get their saved profile
  // preference, everyone else falls back to what's in localStorage.
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored === 'en' || stored === 'ar') {
      setLangState(stored);
    }
  }, []);

  useEffect(() => {
    const profileLang = userProfile?.language;
    if (profileLang === 'en' || profileLang === 'ar') {
      setLangState(profileLang);
    }
  }, [userProfile]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const setLang = useCallback(
    (next: Lang) => {
      setLangState(next);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, next);
      }
      if (firestore && user) {
        setDocumentNonBlocking(doc(firestore, 'users', user.uid), { language: next }, { merge: true });
      }
    },
    [firestore, user]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir: lang === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

/** Picks the field matching the active language, falling back to English. */
export function useLocalizedField() {
  const { lang } = useLanguage();
  return useCallback(
    (enValue: string, arValue: string | undefined) => pickLocalizedValue(lang, enValue, arValue),
    [lang]
  );
}
