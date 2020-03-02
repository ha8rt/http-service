export function b64EncodeUnicode(str: string) {
   // tslint:disable-next-line: variable-name
   return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
   }));
}

export function b64DecodeUnicode(str: string) {
   return decodeURIComponent(atob(str).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
   }).join(''));
}
