import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IObject {
   [key: string]: any;
}

export interface IData {
   http: HttpClient;
   api: string;
   params?: IObject;
   body?: IObject;
   id?: any;
}

export type ICallback<T> = (value: HttpResponse<T>) => void;
export type IObservable<T> = Observable<HttpResponse<T>>;

export class Observables {
   public static get<T>(data: IData, options: any = { observe: 'response' }): IObservable<T> {
      if (data.params) {
         options = Object.assign(options, { params: removeUndefined(data.params) });
      }
      return data.http.get<T>(data.api, options) as Observable<HttpResponse<T>>;
   }

   public static post<T>(data: IData): IObservable<T> {
      return data.http.post<T>(data.api, removeUndefined(data.body), { observe: 'response' });
   }

   public static patch<T>(data: IData): IObservable<T> {
      return data.http.patch<T>(data.api + (data.id ? ('/' + data.id) : ''), removeUndefined(data.body), { observe: 'response' });
   }

   public static put<T>(data: IData): IObservable<T> {
      return data.http.put<T>(data.api, removeUndefined(data.body), { observe: 'response' });
   }

   public static delete<T>(data: IData): IObservable<T> {
      return data.http.delete<T>(data.api + (data.id ? ('/' + data.id) : ''), { observe: 'response' });
   }

   public static download<T>(data: IData): IObservable<T> {
      return Observables.get<T>(data, { responseType: 'blob', observe: 'response' });
   }

   public static upload<T>(data: IData): IObservable<T> {
      return data.http.put<T>(data.api, data.body, { observe: 'events' as 'response', reportProgress: true });
   }
}

function removeUndefined(object?: IObject): IObject {
   const cleanObject: object = {};
   if (object) {
      Object.keys(object).forEach((key) => {
         if (object[key] !== undefined) {
            cleanObject[key] = object[key];
         }
      });
   }
   return cleanObject;
}
