import { InitButton, ButtonType, ModalHandler } from '@ha8rt/modal';

export function timeoutHandler(): ModalHandler {
   const handler: ModalHandler = new ModalHandler();
   handler.title = 'Session timeout.';
   handler.text = 'Your session has expired, please log in again!';
   [handler.buttons] = InitButton({ type: ButtonType.Ok, prefix: 'timeout' }, 1);
   handler.keyboard = false;
   handler.ignoreBackdropClick = true;
   handler.closeButton = false;
   return handler;
}
