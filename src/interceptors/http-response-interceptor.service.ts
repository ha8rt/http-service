import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ButtonType, InitButton, ModalHandler } from '@ha8rt/modal';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { httpCodes, internalErrors } from '../config/config';
import { blobToString } from '../handlers/handlers';
import { isResultValid } from './is.result.valid.handler';
import { translate } from '../translation/translate';

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
                  this.error.change.next({
                     title: translate(res.statusText),
                     text: translate(result ? result : ' '),
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
