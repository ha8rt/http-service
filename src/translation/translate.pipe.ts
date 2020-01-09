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

// export function translateDropdown(dropdown: IDropdown) {
//    translateSubmenus([dropdown]);
// }

// function translateSubmenus(submenus: IDropdown[]) {
//    if (submenus) {
//       submenus.forEach((submenu) => {
//          if (submenu) {
//             submenu.text = translate(submenu.text);
//             submenu.tooltip = translate(submenu.tooltip);
//             if (submenu.icon) {
//                submenu.icon.tooltip = translate(submenu.icon.tooltip);
//             }
//             translateSubmenus(submenu.submenus);
//          }
//       });
//    }
// }

// export function translateHeaders(headers: Headers) {
//    headers.rows.forEach((row) => {
//       row.forEach((header) => {
//          header.str = translate(header.str);
//       });
//    });
// }

// export function translateRows(rows: any[], fields: string[]) {
//    rows.forEach((row) => {
//       fields.forEach((field) => {
//          row[field] = translate(row[field]);
//       });
//    });
// }

// export function translateButtons(buttons: IButton[]) {
//    buttons.forEach((button) => {
//       if (button) {
//          button.text = translate(button.text);
//          button.tooltip = translate(button.tooltip);
//          if (button.icon) {
//             button.icon.tooltip = translate(button.icon.tooltip);
//          }
//       }
//    });
// }

// export function translateModal(handler: IModalHandler): IModalHandler {
//    handler.body.forEach((body) => {
//       body.label = translate(body.label);
//       body.placeHolder = translate(body.placeHolder);
//       body.default = translate(body.default);
//    });
//    handler.buttons.forEach((button) => button.value = translate(button.value));
//    // handler.errors
//    handler.text = translate(handler.text);
//    handler.title = translate(handler.title);
//    handler.reqAlert = translate(handler.reqAlert);
//    return handler;
// }

// export function translateFlags(targetRows: any[], targetField: string, sourceRows: any[], matchField: string, sourceField: string) {
//    targetRows.forEach((targetRow) => {
//       const source = sourceRows.find((sourceRow) => String(sourceRow[matchField]) === String(targetRow[targetField]));
//       targetRow[targetField] = source ? source[sourceField] : targetRow[targetField];
//    });
// }

// export function translateMenus(rows: any[]): any[] {
//    rows.forEach(row => {
//       row.menu = String(row.menu).split(' > ').reduce<string>((previous, current) =>
//          previous + (previous.length > 0 ? ' > ' : '') + translate(current), '');
//    });
//    return rows;
// }
