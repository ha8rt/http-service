import { NgZone } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterStateSnapshot } from '@angular/router';

export class Redirect {
   private defaultUrl = '/';
   private reloadUrl = '/reload';

   constructor(private router: Router, private route: ActivatedRoute) { }

   // public get urlAfterRedirects(): string | null {
   public getUrlAfterRedirects(): string | null {
      return localStorage.getItem('urlAfterRedirects');
   }

   // public set urlAfterRedirects(urlAfterRedirects: string | null) {
   public setUrlAfterRedirects(urlAfterRedirects: string | null) {
      if (!urlAfterRedirects) {
         localStorage.removeItem('urlAfterRedirects');
      } else {
         localStorage.setItem('urlAfterRedirects', urlAfterRedirects);
      }
   }

   public async toDefaultUrl(state?: RouterStateSnapshot, returnUrl = true) {
      const zone = new NgZone({ enableLongStackTrace: true });
      await zone.run(() => this.router.navigate([this.defaultUrl], returnUrl ? {
         queryParams: { returnUrl: state?.url || this.getUrlAfterRedirects() },
      } : {}));
   }

   public async toReturnUrl() {
      const fullUrl = this.route.snapshot.queryParamMap.get('returnUrl') || this.getUrlAfterRedirects() || this.defaultUrl;
      const { url, queryParams } = this.getUrlData(fullUrl);
      const zone = new NgZone({ enableLongStackTrace: true });
      await zone.run(() => this.router.navigate([url], { queryParams }));
   }

   public getUrlData(url: string): { url: string, queryParams: Params } {
      const queryParams = {};
      new URLSearchParams(url.split('?')[1]).forEach((value, key) => {
         queryParams[key] = value;
      });
      url = url.split('?')[0];
      return { url, queryParams };
   }

   public async reloadPage(callback: () => void): Promise<boolean> {
      const { url, queryParams } = this.getUrlData(this.getUrlAfterRedirects() || '');
      // zone.run megoldja a form validációs hibákat, és a warningokat
      const zone = new NgZone({ enableLongStackTrace: true });
      if (await zone.run(() => this.router.navigate([this.reloadUrl || this.defaultUrl]))) {
         if (await zone.run(() => this.router.navigate([url], { queryParams }))) {
            callback();
            return true;
         }
      }
      callback();
      return false;
   }

   public getDefaultUrl(): string {
      return this.defaultUrl;
   }

   public setDefaultUrl(defaultUrl: string) {
      this.defaultUrl = defaultUrl;
   }

   public getReloadUrl(): string {
      return this.reloadUrl;
   }

   public setReloadUrl(reloadUrl: string) {
      this.reloadUrl = reloadUrl;
   }
}
