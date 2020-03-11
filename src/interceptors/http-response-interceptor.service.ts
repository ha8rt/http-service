import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ButtonType, InitButton, ModalHandler } from '@ha8rt/modal';
import { replace } from 'lodash';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { httpCodes, internalErrors } from '../config/config';
import { blobToString } from '../handlers/handlers';
import { translate } from '../translation/translate';
import { isResultValid } from './is.result.valid.handler';

@Injectable({
   providedIn: 'root'
})
export class HttpResponseInterceptorService {
   constructor(
      private isRight: (right: string) => boolean,
      private timeout: ModalHandler,
      private onUnauthorized: (error: any, url: string) => void,
      private internalError: ModalHandler,
      private error: ModalHandler,
   ) { }

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
         map((event: HttpEvent<any>) => {
            return event;
         }),
         catchError((res: HttpErrorResponse) => {
            if (res.status === httpCodes.forbidden) {
               if (this.isRight('LOGGED_IN')) {
                  this.timeout.event.next();
               }
            } else if (res.status === httpCodes.unauthorized) {
               if (this.isRight('LOGGED_IN')) {
                  this.onUnauthorized(res.error, req.urlWithParams);
               }
            } else if (internalErrors.includes(res.status)) {
               this.internalError.event.next();

            } else if (!isResultValid(res)) {
               blobToString(res.error, (result) => {
                  if (!result && res.status === httpCodes.notFound) {
                     result = 'Records are not found for this search!';
                  }
                  const format = (str: string) => {
                     let formatted = translate(str.split('#')[0].trim()) || '';
                     str.split('#').slice(1).forEach((variable) => {
                        formatted = replace(formatted, new RegExp('_' + variable.split('=')[0].trim(), 'g'), variable.split('=')[1].trim());
                     });
                     return formatted;
                  };
                  this.error.change.next({
                     title: translate(res.statusText),
                     text: result ? format(result) : ' ',
                     buttons: InitButton({ prefix: 'error', type: ButtonType.Ok }, 1)[0]
                  });
                  this.error.event.next();
               });
            }
            return throwError(res);
         })
      );
   }
}
