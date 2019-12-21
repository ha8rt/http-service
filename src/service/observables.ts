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
         options = Object.assign(options, { params: data.params });
      }
      return data.http.get<T>(data.api, options) as Observable<HttpResponse<T>>;

      // if (!params.filter) {
      //    return params.http.get(params.api, options) as any;
      // }
      // const filterStr = params.filter.toString();
      // let body: IObject = {};
      // if (filterStr.length > Config.maxFilterLength || params.sort) { body = Object.assign(body, { filter: params.filter.toObject() }); }
      // if (params.sort) { body = Object.assign(body, { sort: params.sort.toObject() }); }
      // if (Object.keys(body).length > 0) {
      //    return params.http.post<T>(params.api + '/query', body, options);
      // } else {
      //    return params.http.get<T>(params.api + '/' + filterStr, options);
      // }
   }

   public static post<T>(data: IData): IObservable<T> {
      return data.http.post<T>(data.api, data.body, { observe: 'response' });
   }

   public static patch<T>(data: IData): IObservable<T> {
      return data.http.patch<T>(data.api + (data.id ? ('/' + data.id) : ''), data.body, { observe: 'response' });
   }

   public static put<T>(data: IData): IObservable<T> {
      return data.http.put<T>(data.api, data.body, { observe: 'response' });
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
