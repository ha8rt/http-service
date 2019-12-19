import { Observable, Subject } from 'rxjs';
import { HttpResponse, HttpClient, HttpEventType } from '@angular/common/http';
import { Observables, IObject, IParams, ICallback, IObservable } from './observables';
import { IQuery } from './query';
import { saveAs } from 'file-saver';
import { Body } from '../body/body';

export abstract class Service {
   constructor(protected http: HttpClient) { }

   abstract _get<T>(filter?: IQuery, callback?: ICallback<T>, sort?: IQuery): IObservable<T>;
   abstract _post<T>(body: Body, callback?: ICallback<T>): IObservable<T>;
   abstract _patch<T>(body: Body, callback?: ICallback<T>): IObservable<T>;
   abstract _put<T>(obj: IObject, callback?: ICallback<T>): IObservable<T>;
   abstract _delete<T>(body: Body, callback?: ICallback<T>): IObservable<T>;
   abstract _download<T>(filter: IQuery, callback?: ICallback<T>): IObservable<T>;
   abstract _upload(files: File[], callback: (listener: Observable<any>) => void): Observable<any>;

   protected get<T>(api: string, filter?: IQuery, sort?: IQuery, callback?: ICallback<T>): IObservable<T> {
      const param: IParams = { http: this.http, api, filter, sort };
      if (!callback) {
         return Observables.get<T>(param);
      }
      return this.subscribe<T>(Observables.get, param, callback);
   }

   protected post<T>(api: string, body: Body, callback?: ICallback<T>): IObservable<T> {
      const param: IParams = { http: this.http, api, body };
      if (!callback) {
         return Observables.post<T>(param);
      }
      return this.subscribe<T>(Observables.post, param, callback);
   }

   protected patch<T>(api: string, body: Body, callback?: ICallback<T>): IObservable<T> {
      const param: IParams = { http: this.http, api, body };
      if (!callback) {
         return Observables.patch<T>(param);
      }
      return this.subscribe<T>(Observables.patch, param, callback);
   }

   protected put<T>(api: string, obj: IObject, callback?: ICallback<T>): IObservable<T> {
      const param: IParams = { http: this.http, api, obj };
      if (!callback) {
         return Observables.put<T>(param);
      }
      return this.subscribe<T>(Observables.put, param, callback);
   }

   protected delete<T>(api: string, id: string, callback?: ICallback<T>): IObservable<T> {
      const param: IParams = { http: this.http, api, id };
      if (!callback) {
         return Observables.delete<T>(param);
      }
      return this.subscribe<T>(Observables.delete, param, callback);
   }

   protected download<T>(api: string, filter: IQuery, callback?: ICallback<T>): IObservable<T> {
      const param: IParams = { http: this.http, api, filter };
      if (!callback) {
         return Observables.download<T>(param);
      }
      return this.subscribe<T>(Observables.download, param, (value) => {
         const contentDisposition: string = value.headers.get('Content-Disposition');
         const contentType: string = value.headers.get('Content-Type');
         const parts: string[] = contentDisposition.split(';');
         const filename = parts[1].split('=')[1].split('\"')[1];
         const blob = new Blob([value.body], { type: contentType });
         saveAs(blob, filename);
         // callback(filename);
      });
   }

   protected upload(api: string, files: File[], callback?: (listener: Observable<any>) => void): Observable<any> | any {
      const data = new FormData();
      for (const file of files) { if (file) { data.append('uploads', file, file.name); } }
      const param: IParams = { http: this.http, api, data };
      if (!callback) {
         return Observables.upload(param);
      }
      const event = new Subject<any>();
      callback(event.asObservable());
      Observables.upload(param).subscribe((progress) => {
         if (progress.type === HttpEventType.UploadProgress && progress.total) {
            event.next(Math.round(progress.loaded / progress.total * 100));
         } else if (progress instanceof HttpResponse) {
            event.next(progress);
         }
      });
   }

   private subscribe<T>(
      obs: (params: IParams) => IObservable<T>,
      params: IParams,
      callback: (value: HttpResponse<any> | any) => void,
   ): IObservable<T> {
      obs(params).subscribe((value) => {
         callback(value);
      }, (error) => {
         callback(error);
      });
      return undefined as unknown as IObservable<T>;
   }
}
