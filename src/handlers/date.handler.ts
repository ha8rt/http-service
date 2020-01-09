import localeHu from '@angular/common/locales/hu';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeHu);
import { DatePipe } from '@angular/common';

export function getDateFormatted(format: string, date?: Date) {
   return (new DatePipe('hu-HU')).transform(date ? date : Date.now(), format);
}
