import { IObject } from '../service/observables';

export interface IElement {
   id: string;
   value: any;
   disabled?: boolean;
}

export type BodyType = (string | IElement[])[];

export class Body {
   private value: BodyType;

   constructor(key: string, values: IElement[]) {
      this.value = [key, values];
   }

   getKey(): string {
      return this.value[0] as string;
   }

   getField(field: string): string {
      const element = (this.value[1] as IElement[]).find((value) => value.id === field);
      return element ? element.value : undefined;
   }

   getId(): string {
      const element = (this.value[1] as IElement[]).find((value) => value.id.split('-').reverse()[0] === 'id');
      return element ? element.value : undefined;
   }

   getPatchValues(): object {
      const obj: IObject = {};
      (this.value[1] as IElement[]).forEach(element => {
         if (!element.disabled) {
            obj[element.id.split('-').reverse()[0]] = element.value === undefined ? null : element.value;
         }
      });
      return obj;
   }

   getElement(id: string): IElement | undefined {
      return (this.value[1] as IElement[]).find((value) => value.id === id);
   }
}
