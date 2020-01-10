import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
   providedIn: 'root'
})
export class HttpLoadingInterceptorService implements HttpInterceptor {
   // ha nem inicializáljuk, akkor nem szám
   static reqs = 0;
   static spinner: NgxSpinnerService;

   constructor(spinner: NgxSpinnerService) {
      HttpLoadingInterceptorService.spinner = spinner;
   }

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if (HttpLoadingInterceptorService.reqs === 0) {
         HttpLoadingInterceptorService.spinner.show();
      }
      HttpLoadingInterceptorService.reqs++;

      return next.handle(req).pipe(finalize(() => {
         HttpLoadingInterceptorService.reqs--;
         if (HttpLoadingInterceptorService.reqs === 0) {
            HttpLoadingInterceptorService.spinner.hide();
         }
      }));
   }
}
