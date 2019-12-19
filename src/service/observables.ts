import { Observable } from 'rxjs';
import { HttpResponse, HttpClient, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { IQuery } from './query';
import { Body } from '../body/body';
import { Config } from '../config/config';

export interface IObject {
   [key: string]: any;
}

export interface IParams {
   http: HttpClient;
   api: string;
   filter?: IQuery;
   sort?: IQuery;
   body?: Body;
   obj?: IObject;
   id?: string;
   data?: FormData;
}

export type ICallback<T> = (value: HttpResponse<T>) => void;
export type IObservable<T> = Observable<HttpEvent<T>>;

export class Observables {
   public static get<T>(params: IParams, options: any = { observe: 'response', params: { alma: '%/alma23é;' } }): IObservable<T> {
      if (!params.filter) {
         return params.http.get(params.api, options) as any;
      }
      const filterStr = params.filter.toString();
      let body: IObject = {};
      if (filterStr.length > Config.maxFilterLength || params.sort) { body = Object.assign(body, { filter: params.filter.toObject() }); }
      if (params.sort) { body = Object.assign(body, { sort: params.sort.toObject() }); }
      if (Object.keys(body).length > 0) {
         return params.http.post<T>(params.api + '/query', body, options);
      } else {
         return params.http.get<T>(params.api + '/' + filterStr, options);
      }
   }

   public static post<T>(params: IParams): IObservable<T> {
      return params.http.post<T>(params.api, params.body ? params.body.getPatchValues() : {}, { observe: 'response' });
   }

   public static patch<T>(params: IParams): IObservable<T> {
      const id = params.body ? params.body.getId() : undefined;
      const patchValues = params.body ? params.body.getPatchValues() : undefined;
      return params.http.patch<T>(params.api + '/' + id, patchValues, { observe: 'response' });
   }

   public static put<T>(params: IParams): IObservable<T> {
      return params.http.put<T>(params.api, params.obj, { observe: 'response' });
   }

   public static delete<T>(params: IParams): IObservable<T> {
      return params.http.delete<T>(params.api + (params.id ? ('/' + params.id) : ''), { observe: 'response' });
   }

   public static download<T>(params: IParams): IObservable<T> {
      return Observables.get<T>(params, { responseType: 'blob', observe: 'response' });
   }

   public static upload<T>(params: IParams): IObservable<T> {
      return params.http.put<T>(params.api, params.data, { observe: 'events' as 'response', reportProgress: true });
   }
}
