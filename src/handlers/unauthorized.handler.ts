import { InitButton, ButtonType, IModalHandler, initModal } from '@ha8rt/modal';

export function unauthorizedHandler(): IModalHandler {
   const handler: IModalHandler = initModal();
   handler.title = 'Unauthorized.';
   handler.text = 'You are not authorized to perform this operation.';
   [handler.buttons] = InitButton({ type: ButtonType.Ok, prefix: 'unauthorized' }, 1);
   handler.keyboard = false;
   handler.ignoreBackdropClick = true;
   handler.closeButton = false;
   return handler;
}
