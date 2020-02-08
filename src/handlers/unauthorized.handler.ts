import { InitButton, ButtonType, ModalHandler } from '@ha8rt/modal';

export function unauthorizedHandler(): ModalHandler {
   const handler: ModalHandler = new ModalHandler();
   handler.title = 'Unauthorized.';
   handler.text = 'You are not authorized to perform this operation.';
   [handler.buttons] = InitButton({ type: ButtonType.Ok, prefix: 'unauthorized' }, 1);
   handler.keyboard = false;
   handler.ignoreBackdropClick = true;
   handler.closeButton = false;
   return handler;
}
