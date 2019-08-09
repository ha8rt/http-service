import { Observable } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { IQuery } from './query';
import { Body } from '../body/body';
import { Config } from '../config/config';

export interface ObjType {
   [key: string]: any;
}

export interface Param {
   http: HttpClient;
   api: string;
   filter?: IQuery;
   sort?: IQuery;
   body?: Body;
   obj?: ObjType;
   id?: string;
   data?: FormData;
}

export class Obs {
   public static get(param: Param): Observable<HttpResponse<any>> {
      if (!param.filter) {
         return param.http.get(param.api, { observe: 'response' }) as any;
      }
      const filterStr = param.filter.toString();
      let body: ObjType = {};
      if (filterStr.length > Config.maxFilterLength || param.sort) { body = Object.assign(body, { filter: param.filter.toObject() }); }
      if (param.sort) { body = Object.assign(body, { sort: param.sort.toObject() }); }
      if (Object.keys(body).length > 0) {
         return param.http.post(param.api + '/query', body, { observe: 'response' }) as any;
      } else {
         return param.http.get(param.api + '/' + filterStr, { observe: 'response' }) as any;
      }
   }

   public static post(param: Param): Observable<HttpResponse<any>> {
      return param.http.post(param.api, param.body ? param.body.getPatchValues() : {}, { observe: 'response' });
   }

   public static patch(param: Param): Observable<HttpResponse<any>> {
      const id = param.body ? param.body.getId() : undefined;
      const patchValues = param.body ? param.body.getPatchValues() : undefined;
      return param.http.patch(param.api + '/' + id, patchValues, { observe: 'response' });
   }

   public static put(param: Param): Observable<HttpResponse<any>> {
      return param.http.put(param.api, param.obj, { observe: 'response' });
   }

   public static delete(param: Param): Observable<HttpResponse<any>> {
      return param.http.delete(param.api + '/' + param.id, { observe: 'response' }) as any;
   }

   public static download(param: Param): Observable<any> {
      return param.http.get(param.api + '/' + param.id, { responseType: 'blob', observe: 'response' }) as any;
   }

   public static upload(param: Param): Observable<any> {
      return param.http.put(param.api, param.data, { observe: 'events', reportProgress: true }) as any;
   }
}
