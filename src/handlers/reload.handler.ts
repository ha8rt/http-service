import { InitButton, ButtonType, ModalHandler } from '@ha8rt/modal';

export function reloadHandler(): ModalHandler {
   const handler: ModalHandler = new ModalHandler();
   handler.title = 'Upgrade available.';
   handler.text = 'Do you want to reload the page to upgrade?';
   [handler.buttons] = InitButton({ type: ButtonType.OkCancel, prefix: 'reload' }, 1);
   handler.keyboard = false;
   handler.ignoreBackdropClick = true;
   handler.closeButton = false;
   return handler;
}
