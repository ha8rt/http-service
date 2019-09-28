import { ParamMap } from '@angular/router';
import { ObjType } from './obs';

export class IQuery {
   private value: IType[];

   constructor(value: IType[]) {
      this.value = value;
   }

   addFilter(filter: IType): IQuery {
      this.value.push(filter);
      return this;
   }

   addQuery(query: IQuery): IQuery {
      this.value = this.value.concat(query.getValue());
      return this;
   }

   getValue(): IType[] {
      return this.value;
   }

   toString(): string {
      let str = '';
      this.value.forEach((element) => {
         str += element.toString() + ':';
      });
      return str;
   }

   toObject(): object {
      let obj: ObjType = {};
      this.value.forEach((element) => {
         obj = Object.assign(obj, element.toObject());
      });
      return obj;
   }
}

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
         return this.value ? this.field + '=' + this.value : '';
      }
   }

   toObject(): object {
      const obj: ObjType = {};
      if (this.modifier) {
         const mod: ObjType = {};
         mod['$' + this.modifier] = this.value;
         obj[this.field] = mod;
      } else {
         obj[this.field] = this.value;
      }
      return obj;
   }
}

export class Query {
   static active = new IType('isActive', 'true');
   static duped = new IType('status', 4);
   static sort = {
      callsign: new IType('callsign', 1),
      callsignValue: new IType('callsign.value', 1),
      round: new IType('round', 'asc'),
      roundCode: new IType('round.code', 1),
      statusDesc: new IType('status', 'desc'),
   };
}


export function getParamFilter(params: ParamMap, modifier = 'in'): IQuery {
   const filter: IType[] = [];
   for (const key of params.keys) {
      const value = params.getAll(key);
      filter.push(new IType(key, value.length > 1 ? value : value[0], value.length > 1 ? modifier : ''));
   }
   return new IQuery(filter);
}
