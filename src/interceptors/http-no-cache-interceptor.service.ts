import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class HttpNoCacheInterceptorService implements HttpInterceptor {
   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      req = req.clone({
         setHeaders: {
            'Cache-Control': 'no-cache'
         }
      });
      return next.handle(req);
   }
}
