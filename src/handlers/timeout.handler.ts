import { InitButton, ButtonType, IModalHandler, initModal } from '@ha8rt/modal';

export function timeoutHandler(): IModalHandler {
   const handler: IModalHandler = initModal();
   handler.title = 'Session timeout.';
   handler.text = 'Your session has expired, please log in again!';
   [handler.buttons] = InitButton({ type: ButtonType.Ok, prefix: 'timeout' }, 1);
   handler.keyboard = false;
   handler.ignoreBackdropClick = true;
   handler.closeButton = false;
   return handler;
}
