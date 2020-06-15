import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

export const isResultValid = (value: HttpResponse<any> | HttpErrorResponse) => Math.floor(value.status / 100) === 2;
