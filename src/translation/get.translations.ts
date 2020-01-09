import { defaultLocale, langLocales } from '../config/translate.config';
import { HttpService } from '../service/http.service';
import { isResultValid } from '../interceptors/is.result.valid.handler';
import { ITranslation, TranslatePipe } from './translate.pipe';

export function getTranslations<T>(
   service: HttpService, callback: (translations: T[] | null) => void, locale?: string, loginPage?: boolean
) {
   locale = locale || TranslatePipe.locale;
   service.get<T[]>({ locale, loginPage }, (res) => {
      if (isResultValid(res)) {
         const language = Object.keys(langLocales).find((key) => langLocales[key] === locale);
         const defaultLanguage = Object.entries(langLocales).find((langLocale) => langLocale[1] === defaultLocale)?.[0];
         if (language && defaultLanguage) {
            const translations = res.body?.reduce<ITranslation>((translation, current) => {
               translation[current[defaultLanguage]] = current[language];
               return translation;
            }, {});
            if (translations) {
               TranslatePipe.setTranslations(translations);
            }
         }
         callback(res.body);
      }
   });
}
