import { TranslatePipe } from './translate.pipe';

export function translate(key: string): string | undefined {
   const endWithColon = key ? key.endsWith(':') : false;
   if (endWithColon) {
      key = key.substr(0, key.length - 1);
   }
   const translations = TranslatePipe.getTranslations();
   let translation = '';
   // a nyelv megegyezik a törzs alapértelmezett nyelvével (egyedi kulcs - nem fordítjuk)
   if (TranslatePipe.getLocale() === TranslatePipe.getDefaultLocale()) {
      translation = key;
      // valamelyik bemeneti adat null vagy undefined
   } else if (!key || !translations) {
      translation = key;
      // nem tartalmazza fordítást, vagy üres fordítást tartalmaz
   } else if (!Object.keys(translations).includes(key) || translations[key].length === 0) {
      translation = key;
      // nincs hiba, visszaadjuk a fordítást
   } else {
      translation = translations[key];
   }
   return translation ? (translation + (endWithColon ? ':' : '')) : undefined;
}
