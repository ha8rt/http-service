import { Service } from '../service/service';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { IQuery } from '../service/query';
import { IObject, IObservable, ICallback } from '../service/observables';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import { Config } from '../config/config';
import { Body } from '../body/body';

export interface IApi {
   secure: boolean;
   route: string;
}

export class HttpService extends Service {
   private api!: string;

   constructor(protected http: HttpClient) {
      super(http);
   }

   setApi(api: IApi): HttpService {
      this.api = (api.secure ? Config.secureAPI : Config.publicAPI) + api.route;
      return this;
   }

   _get<T>(filter?: IQuery, callback?: ICallback<T>, sort?: IQuery): IObservable<T> {
      return super.get(this.api, filter, sort, callback);
   }
   _post<T>(body: Body, callback?: ICallback<T>): IObservable<T> {
      return super.post(this.api, body, callback);
   }
   _patch<T>(body: Body, callback?: ICallback<T>): IObservable<T> {
      return super.patch(this.api, body, callback);
   }
   _put<T>(body: IObject, callback?: ICallback<T>): IObservable<T> {
      return super.put(this.api, body, callback);
   }
   _delete<T>(body: Body, callback?: ICallback<T>): IObservable<T> {
      return super.delete(this.api, body ? body.getId() : '', callback);
   }

   _download(filter: IQuery, callback: (value: any) => void): Observable<any> | any {
      return super.download(this.api, filter, callback);
   }
   _upload(files: File[], callback: (listener: Observable<any>) => void): Observable<any> {
      return super.upload(this.api, files, callback);
   }

   _forkJoin(sources: Observable<any>[], callback: (results: HttpResponse<any>[]) => void) {
      forkJoin(sources).subscribe((results) => {
         callback(results);
      }, (error) => {
         callback(error);
      });
   }
}
