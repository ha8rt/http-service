import { Pipe, PipeTransform } from '@angular/core';
import { Locales } from '@ha8rt/modal';
import { isResultValid } from '../interceptors/interceptors';
import { HttpService } from '../service/service';
import { translate } from './translate';

export interface ITranslation {
   [key: string]: string;
}

export interface IGetTranslation {
   en: string;
   hu?: string;
}

@Pipe({
   name: 'translate',
   pure: false,
})
export class TranslatePipe implements PipeTransform {
   private static translations: ITranslation = {};
   private static locale = Locales.en;
   private static defaultLocale = Locales.en;
   private static allowedLocaleKeys = Object.keys(Locales);

   public static getService<T extends IGetTranslation>(
      service: HttpService, loginPage: boolean | undefined, callback: (translations: T[] | null) => void
   ) {
      const defaultLocaleKey = this.getLocaleKey(TranslatePipe.defaultLocale);
      const localeKey = this.getLocaleKey(TranslatePipe.locale);
      service.get<T[]>({ defaultLocale: defaultLocaleKey, locale: localeKey, loginPage }, (res) => {
         if (isResultValid(res)) {
            TranslatePipe.setTranslations(res.body?.reduce<ITranslation>((previous, current) => {
               previous[current[defaultLocaleKey]] = current[localeKey];
               return previous;
            }, {}) || {});
            callback(res.body);
         }
      });
   }

   public static getTranslations(): ITranslation {
      return this.translations;
   }

   public static getLocale(): Locales {
      return this.locale;
   }

   public static getDefaultLocale(): Locales {
      return this.defaultLocale;
   }

   public static getAllowedLocaleKeys(): string[] {
      return this.allowedLocaleKeys;
   }

   public static setTranslation(key: string, value: string): typeof TranslatePipe {
      this.translations[key] = value;
      return this;
   }

   public static setTranslations(translations: ITranslation): typeof TranslatePipe {
      this.translations = Object.assign(this.translations, translations);
      return this;
   }

   public static setLocale(locale: Locales): typeof TranslatePipe {
      if (this.isAllowedLocale(locale)) {
         this.locale = locale;
      }
      return this;
   }

   public static setDefaultLocale(locale: Locales): typeof TranslatePipe {
      if (this.isAllowedLocale(locale)) {
         this.defaultLocale = locale;
      }
      return this;
   }

   public static setAllowedLocaleKeys(keys: Array<keyof typeof Locales>): typeof TranslatePipe {
      this.allowedLocaleKeys = keys;
      return this;
   }

   public static getLocaleKey(locale: Locales): string {
      return Object.keys(Locales).find((key) => Locales[key] === locale) || Object.keys(Locales)[0];
   }

   public static isAllowedLocale(locale: Locales): boolean {
      return this.allowedLocaleKeys.includes(this.getLocaleKey(locale));
   }

   constructor() { }

   transform(value: any): any {
      return translate(value);
   }
}
