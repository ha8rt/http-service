import { httpCodes } from './http.config';

export const internalErrors = [
   httpCodes.badRequest,
   httpCodes.internalError,
   httpCodes.notImplemented,
   httpCodes.badGateway,
   httpCodes.serviceUnavailable,
   httpCodes.gatewayTimeout,
];
