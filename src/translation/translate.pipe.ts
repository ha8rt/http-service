import { Pipe, PipeTransform } from '@angular/core';
import { Locales } from '@ha8rt/modal';
import { defaultLocale } from '../config/translate.config';
import { translate } from './translate';

export interface ITranslation {
   [key: string]: string;
}

export interface IGetTranslation {
   ROWID: string;
   ENG: string;
   HUN?: string;
   POL?: string;
   RON?: string;
   LOGIN_PAGE: number;
   CREATE_DATE: Date;
}

@Pipe({
   name: 'translate',
   pure: false,
})
export class TranslatePipe implements PipeTransform {
   static translations: ITranslation = {};
   static locale = defaultLocale;
   static defaultLocale = defaultLocale;

   public static setTranslation(key: string, value: string): typeof TranslatePipe {
      this.translations[key] = value;
      return this;
   }

   public static setTranslations(translations: ITranslation): typeof TranslatePipe {
      this.translations = Object.assign(this.translations, translations);
      return this;
   }

   public static setLocale(locale: Locales): typeof TranslatePipe {
      this.locale = locale;
      return this;
   }

   public static setDefaultLocale(locale: Locales): typeof TranslatePipe {
      this.defaultLocale = locale;
      return this;
   }

   constructor() { }

   transform(value: any): any {
      return translate(value);
   }
}
