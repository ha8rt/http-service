import { ParamMap } from '@angular/router';
import { IObject } from './observables';

export class IType {
   field: string;
   modifier?: string;
   value: any;

   constructor(field: string, value: any, modifier?: string) {
      this.field = field;
      this.value = value;
      if (modifier) {
         this.modifier = modifier;
      }
   }

   toString(): string {
      if (this.modifier) {
         return this.field + '$' + this.modifier + '$' + (this.value instanceof Array ? this.value.join(',') : this.value);
      } else {
         return this.value !== undefined ? this.field + '=' + this.value : '';
      }
   }

   toObject(): object {
      const obj: IObject = {};
      if (this.modifier) {
         const mod: IObject = {};
         mod['$' + this.modifier] = this.value;
         obj[this.field] = mod;
      } else if (this.value !== undefined) {
         obj[this.field] = this.value;
      }
      return obj;
   }
}

export class IQuery {
   private value: IType[];

   constructor(value: IType[]) {
      this.value = value.filter((type) => type ? true : false);
   }

   addFilter(filter: IType): IQuery {
      this.value.push(filter);
      return this;
   }

   addQuery(query: IQuery | object): IQuery {
      if (query instanceof IQuery) {
         this.value = this.value.concat(query.getValue());
      } else {
         this.value = this.value.concat(Object.keys(query).map((key) => new IType(key, query[key])));
      }
      return this;
   }

   getValue(): IType[] {
      return this.value;
   }

   toString(): string {
      let str = '';
      this.value.forEach((element) => {
         const elem = element.toString();
         str += elem + (elem ? ':' : '');
      });
      return str;
   }

   toObject(): object {
      let obj: IObject = {};
      this.value.forEach((element) => {
         obj = Object.assign(obj, element.toObject());
      });
      return obj;
   }
}

export function getParamFilter(params: ParamMap, modifier = 'in'): IQuery {
   const filter: IType[] = [];
   for (const key of params.keys) {
      const value = params.getAll(key);
      filter.push(new IType(key, value.length > 1 ? value : value[0], value.length > 1 ? modifier : ''));
   }
   return new IQuery(filter);
}
