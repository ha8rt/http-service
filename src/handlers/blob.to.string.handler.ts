export function blobToString(blob: Blob | string, callback: (result: string) => void) {
   if (blob instanceof Blob) {
      const reader = new FileReader();
      reader.addEventListener('loadend', (e) => {
         callback(JSON.parse(String((e.target as FileReader).result)));
      });
      reader.readAsText(blob);
   } else {
      callback(blob);
   }
}
