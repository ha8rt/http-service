import { Service, ConstructType } from '../service/service';
import { HttpResponse } from '@angular/common/http';
import { IQuery } from '../service/query';
import { ObjType } from '../service/obs';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import { Config } from '../config/config';
import { Body } from '../body/body';

export interface Api {
   secure: boolean;
   route: string;
}

export class HttpService extends Service {
   private api!: string;

   constructor(protected construct: ConstructType) {
      super(construct);
   }

   setApi(api: Api): HttpService {
      this.api = (api.secure ? Config.secureAPI : Config.publicAPI) + api.route;
      return this;
   }

   _get(filter?: IQuery, callback?: (value: any) => void, sort?: IQuery): Observable<HttpResponse<any>> | any {
      return super.get(this.api, (filter as IQuery), (sort as IQuery), (callback as (value: any) => void));
   }
   _post(body: Body, callback: (value: any) => void): Observable<HttpResponse<any>> | any {
      return super.post(this.api, body, callback);
   }
   _patch(body: Body, callback: (value: any) => void): Observable<HttpResponse<any>> | any {
      return super.patch(this.api, body, callback);
   }
   _put(obj: ObjType, callback: (value: any) => void): Observable<HttpResponse<any>> {
      return super.put(this.api, obj, callback);
   }
   _delete(body: Body, callback: (value: any) => void): Observable<HttpResponse<any>> | any {
      return super.delete(this.api, body.getId(), callback);
   }
   _download(id: string, callback: (value: any) => void): Observable<any> | any {
      return super.download(this.api, id, callback);
   }
   _upload(files: File[], callback: (listener: Observable<any>) => void): Observable<any> {
      return super.upload(this.api, files, callback);
   }

   _forkJoin(sources: Observable<any>[], callback: (results: HttpResponse<any>[]) => void) {
      const spinner = this.construct.spinner;
      if (spinner) { spinner.show(); }
      forkJoin(sources).subscribe((results) => {
         if (spinner) { spinner.hide(); }
         callback(results);
      }, (error) => {
         if (spinner) { spinner.hide(); }
         callback(error);
      });
   }
}
