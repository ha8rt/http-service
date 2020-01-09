import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { httpCodes } from '../config/http.config';

export function isResultValid(value: HttpResponse<any> | HttpErrorResponse): boolean {
   if (value.status === httpCodes.ok) {
      return true;
   } else {
      return false;
   }
}
