import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Body } from '@ha8rt/modal';
import { saveAs } from 'file-saver';
import { forkJoin, Observable, Subject } from 'rxjs';
import { ICallback, IData, IObject, IObservable, Observables } from './observables';
import { IQuery } from './query';

export interface IApi {
   secure: boolean;
   route: string;
}

export class HttpService {
   private api = '';

   constructor(private http: HttpClient, api?: string) {
      this.api = api ? api : this.api;
   }

   public setApi(api: IApi): HttpService {
      this.api = (api.secure ? '/api' : '/api/public') + api.route;
      return this;
   }

   public get<T>(params: IObject | IQuery, callback?: ICallback<T>): IObservable<T> {
      const data: IData = { http: this.http, api: this.api, params: params?.toObject ? params.toObject() : params };
      if (!callback) {
         return Observables.get<T>(data);
      }
      return this.subscribe<T>(Observables.get, data, callback);
   }

   public post<T>(body: IObject | Body, callback?: ICallback<T>): IObservable<T> {
      const data: IData = { http: this.http, api: this.api, body: body?.getPatchValues ? body.getPatchValues() : body };
      if (!callback) {
         return Observables.post<T>(data);
      }
      return this.subscribe<T>(Observables.post, data, callback);
   }

   public patch<T>(id: any, body: IObject | Body, callback?: ICallback<T>): IObservable<T> {
      const data: IData = { http: this.http, api: this.api, body: body?.getPatchValues ? body.getPatchValues() : body, id };
      if (!callback) {
         return Observables.patch<T>(data);
      }
      return this.subscribe<T>(Observables.patch, data, callback);
   }

   public put<T>(body: IObject | Body, callback?: ICallback<T>): IObservable<T> {
      const data: IData = { http: this.http, api: this.api, body: body?.getPatchValues ? body.getPatchValues() : body };
      if (!callback) {
         return Observables.put<T>(data);
      }
      return this.subscribe<T>(Observables.put, data, callback);
   }

   public delete<T>(id: any, callback?: ICallback<T>): IObservable<T> {
      const data: IData = { http: this.http, api: this.api, id };
      if (!callback) {
         return Observables.delete<T>(data);
      }
      return this.subscribe<T>(Observables.delete, data, callback);
   }

   public download(params: IObject, callback: (value: any) => void): Observable<any> {
      if (params instanceof IQuery) {
         params = params.toObject();
      }
      const data: IData = { http: this.http, api: this.api, params };
      if (!callback) {
         return Observables.download<any>(data);
      }
      return this.subscribe<any>(Observables.download, data, (value) => {
         const res = value as HttpResponse<any>;
         const contentDisposition: string = String(res.headers.get('Content-Disposition'));
         const contentType: string = String(res.headers.get('Content-Type'));
         const parts: string[] = contentDisposition.split(';');
         const filename = parts[1].split('=')[1].split('\"')[1];
         if (res.body) {
            const blob = new Blob([res.body], { type: contentType });
            saveAs(blob, filename);
         }
         // callback(filename);
      });
   }

   public upload(files: File[], callback: (listener: Observable<any>) => void): Observable<any> {
      const body = new FormData();
      for (const file of files) { if (file) { body.append('uploads', file, file.name); } }
      const data: IData = { http: this.http, api: this.api, body };
      if (!callback) {
         return Observables.upload(data);
      }
      const event = new Subject<any>();
      callback(event.asObservable());
      return this.subscribe<any>(Observables.upload, data, (progress: any) => {
         if (progress.type === HttpEventType.UploadProgress && progress.total) {
            event.next(Math.round(progress.loaded / progress.total * 100));
         } else if (progress instanceof HttpResponse) {
            event.next(progress);
         }
      });
   }

   public forkJoin(sources: Observable<any>[], callback: (results: HttpResponse<any>[]) => void): void {
      forkJoin(sources).subscribe((results) => { callback(results); }, (error) => { callback(error); });
   }

   private subscribe<T>(obs: (data: IData) => IObservable<T>, data: IData, callback: ICallback<T>): IObservable<T> {
      obs(data).subscribe((value) => { callback(value); }, (error) => { callback(error); });
      return undefined as unknown as IObservable<T>;
   }
}
