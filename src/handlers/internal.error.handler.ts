import { InitButton, ButtonType, IModalHandler, initModal } from '@ha8rt/modal';

export function internalErrorHandler(): IModalHandler {
   const handler: IModalHandler = initModal();
   handler.title = 'Error happened.';
   handler.text = 'Please try again later, or try refreshing the page.';
   [handler.buttons] = InitButton({ type: ButtonType.Ok, prefix: 'internal-error' }, 1);
   handler.keyboard = false;
   handler.ignoreBackdropClick = true;
   handler.closeButton = false;
   return handler;
}
