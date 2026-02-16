import { cookies } from 'next/headers';

export const LANGUAGES = ['en', 'ar'] as const;
export type Lang = (typeof LANGUAGES)[number];

export function getLangFromSearchParam(input?: string | null): Lang {
  return input === 'ar' ? 'ar' : 'en';
}

export async function getCurrentLang(): Promise<Lang> {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get('lang')?.value;
  return cookieLang === 'ar' ? 'ar' : 'en';
}

export function isRTL(lang: Lang): boolean {
  return lang === 'ar';
}

export function t(lang: Lang, en: string, ar: string): string {
  return lang === 'ar' ? ar : en;
}
