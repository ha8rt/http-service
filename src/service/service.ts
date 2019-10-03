import { Observable, Subject } from 'rxjs';
import { HttpResponse, HttpClient, HttpEventType } from '@angular/common/http';
import { Obs, ObjType, Param } from './obs';
import { IQuery } from './query';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { Body } from "../body/body";

export interface IConstruct {
   http: HttpClient,
   spinner?: NgxSpinnerService
};

export abstract class Service {
   constructor(protected construct: IConstruct) { }

   abstract _get(
      filter?: IQuery,
      callback?: (value: HttpResponse<any> | any) => void,
      sort?: IQuery,
   ): Observable<HttpResponse<any>> | any;
   abstract _post(body: Body, callback: (value: HttpResponse<any> | any) => void): Observable<HttpResponse<any>> | any;
   abstract _patch(body: Body, callback: (value: HttpResponse<any> | any) => void): Observable<HttpResponse<any>>;
   abstract _put(obj: ObjType, callback: (value: HttpResponse<any> | any) => void): Observable<HttpResponse<any>>;
   abstract _delete(body: Body, callback: (value: HttpResponse<any> | any) => void): Observable<HttpResponse<any>> | any;
   abstract _download(filter: IQuery, callback: (value: HttpResponse<any> | any) => void): Observable<any> | any;
   abstract _upload(files: File[], callback: (listener: Observable<any>) => void): Observable<any>;

   protected get(
      api: string,
      filter: IQuery,
      sort: IQuery,
      callback: (value: HttpResponse<any> | any) => void
   ): Observable<HttpResponse<any>> | any {
      const param: Param = { http: this.construct.http, api, filter, sort };
      if (!callback) {
         return Obs.get(param);
      }
      return this.subscribe(Obs.get, param, callback);
   }

   protected post(
      api: string,
      body: Body,
      callback: (value: HttpResponse<any> | any) => void
   ): Observable<HttpResponse<any>> | any {
      const param: Param = { http: this.construct.http, api, body };
      if (!callback) {
         return Obs.post(param);
      }
      return this.subscribe(Obs.post, param, callback);
   }

   protected patch(
      api: string,
      button: Body,
      callback: (value: HttpResponse<any> | any) => void
   ): Observable<HttpResponse<any>> | any {
      const param: Param = { http: this.construct.http, api, body: button };
      if (!callback) {
         return Obs.patch(param);
      }
      return this.subscribe(Obs.patch, param, callback, false);
   }

   protected put(api: string, obj: ObjType, callback: (value: HttpResponse<any> | any) => void): Observable<HttpResponse<any>> | any {
      const param: Param = { http: this.construct.http, api, obj };
      if (!callback) {
         return Obs.put(param);
      }
      return this.subscribe(Obs.put, param, callback, false);
   }

   protected delete(api: string, id: string, callback: (value: HttpResponse<any> | any) => void): Observable<HttpResponse<any>> | any {
      const param: Param = { http: this.construct.http, api, id };
      if (!callback) {
         return Obs.delete(param);
      }
      return this.subscribe(Obs.delete, param, callback);
   }

   protected download(api: string, filter: IQuery, callback: (value: HttpResponse<any> | any) => void): Observable<HttpResponse<any>> | any {
      const param: Param = { http: this.construct.http, api, filter };
      if (!callback) {
         return Obs.download(param);
      }
      return this.subscribe(Obs.download, param, (value) => {
         const contentDisposition: string = value.headers.get('Content-Disposition');
         const contentType: string = value.headers.get('Content-Type');
         const parts: string[] = contentDisposition.split(';');
         const filename = parts[1].split('=')[1].split('\"')[1];
         const blob = new Blob([value.body], { type: contentType });
         saveAs(blob, filename);
         callback(filename);
      });
   }

   protected upload(api: string, files: File[], callback: (listener: Observable<any>) => void): Observable<any> | any {
      const data = new FormData();
      for (const file of files) { if (file) { data.append('uploads', file, file.name); } }
      const param: Param = { http: this.construct.http, api, data };
      if (!callback) {
         return Obs.upload(param);
      }
      const event = new Subject<any>();
      callback(event.asObservable());
      Obs.upload(param).subscribe((progress) => {
         if (progress.type === HttpEventType.UploadProgress) {
            event.next(Math.round(progress.loaded / progress.total * 100));
         } else if (progress instanceof HttpResponse) {
            event.next(progress);
         }
      });
   }

   private subscribe(
      obs: (param: any) => Observable<HttpResponse<any>>,
      param: any,
      callback: (value: HttpResponse<any> | any) => void,
      isSpinner = true
   ): HttpResponse<any> | any {
      const spinner = this.construct.spinner;
      if (isSpinner && spinner) { spinner.show(); }
      obs(param).subscribe((value) => {
         callback(value);
         if (isSpinner && spinner) { spinner.hide(); }
         return value;
      }, (error) => {
         callback(error);
         if (isSpinner && spinner) { spinner.hide(); }
         return error;
      });
   }
}
