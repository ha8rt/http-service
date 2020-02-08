import { InitButton, ButtonType, ModalHandler } from '@ha8rt/modal';

export function internalErrorHandler(): ModalHandler {
   const handler: ModalHandler = new ModalHandler();
   handler.title = 'Error happened.';
   handler.text = 'Please try again later, or try refreshing the page.';
   [handler.buttons] = InitButton({ type: ButtonType.Ok, prefix: 'internal-error' }, 1);
   handler.keyboard = false;
   handler.ignoreBackdropClick = true;
   handler.closeButton = false;
   return handler;
}
