import { Params } from '@angular/router';
import { Locales } from '@ha8rt/modal';
import { Redirect } from '../redirect/redirect';
import { HttpService } from '../service/service';
import { localeType, TranslatePipe } from './translate.pipe';

interface IAppComponent {
   session: { acceptLanguages: string };
}

interface IThisComponent {
   redirect: Redirect;
   translateService: HttpService;
}

export class TranslateHandler {
   private static localeParam: boolean; // todo manually set language, then keep it

   public static construct(allowedLocaleKeys: Array<localeType>) {
      this.setLocale(this.getLocale() || TranslatePipe.getLocaleKey(TranslatePipe.getDefaultLocale()));
      TranslatePipe.setAllowedLocaleKeys(allowedLocaleKeys);
      TranslatePipe.setLocale(Locales[this.getLocale()] || TranslatePipe.getDefaultLocale());
   }

   public static queryParamMap(queryParamMap: Params) {
      this.localeParam = false;
      if (Object.keys(Locales).includes(queryParamMap.get('locale'))) {
         this.localeParam = true;
         this.setLocale(queryParamMap.get('locale') as any);
         TranslatePipe.setLocale(Locales[this.getLocale()]);
      }
   }

   public static startSession<T extends IAppComponent, U extends IThisComponent>(AppComponent: T, thisComponent: U, callback: () => void) {
      AppComponent.session.acceptLanguages.split(',').some((accept) => {
         const locale = accept.split(';')[0].split('-')[0];
         if (Object.keys(Locales).includes(locale) && !this.localeParam) {
            if (this.getLocale() !== locale) {
               TranslatePipe.setLocale(Locales[locale]);
            }
            return true;
         }
         return false;
      });
      if (TranslatePipe.getLocale() !== TranslatePipe.getDefaultLocale()) {
         TranslatePipe.getService(thisComponent.translateService, true, async () => {
            const localeKey = TranslatePipe.getLocaleKey(TranslatePipe.getLocale());
            if (this.getLocale() !== localeKey) {
               this.setLocale(localeKey);
               await thisComponent.redirect.reloadPage(callback);
            }
         });
      }
   }

   // static get locale(): localeType {
   private static getLocale(): localeType {
      return localStorage.getItem('locale') as localeType;
   }

   // private static set locale(locale: localeType) {
   private static setLocale(locale: localeType) {
      if (!locale) {
         localStorage.removeItem('locale');
      } else if (TranslatePipe.isAllowedLocale(Locales[locale])) {
         localStorage.setItem('locale', locale);
      }
   }
}
