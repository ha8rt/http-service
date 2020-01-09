import { Locales } from '@ha8rt/modal';

export const defaultLocale = Locales.en;
export const codeLocales: { [key: string]: any } = {
   en: Locales.en,
   hu: Locales.hu,
   pl: Locales.pl,
   ro: Locales.ro,
};
export const acceptableLanguages = Object.keys(codeLocales);
export const langLocales: { [key: string]: any } = {
   ENG: Locales.en,
   HUN: Locales.hu,
   POL: Locales.pl,
   RON: Locales.ro
};
