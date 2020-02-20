import { ActivatedRoute, Params, Router, RouterStateSnapshot } from '@angular/router';

export class Redirect {
   private defaultUrl = '/';

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
      await this.router.navigate([this.defaultUrl], returnUrl ? {
         queryParams: { returnUrl: state?.url || this.getUrlAfterRedirects() },
      } : {});
   }

   public async toReturnUrl() {
      const fullUrl = this.route.snapshot.queryParamMap.get('returnUrl') || this.getUrlAfterRedirects() || this.defaultUrl;
      const { url, queryParams } = this.getUrlData(fullUrl);
      await this.router.navigate([url], { queryParams });
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
      if (await this.router.navigate([this.defaultUrl])) {
         if (await this.router.navigate([url], { queryParams })) {
            callback();
            return true;
         }
      }
      return false;
   }

   public getDefaultUrl(): string {
      return this.defaultUrl;
   }

   public setDefaultUrl(defaultUrl: string) {
      this.defaultUrl = defaultUrl;
   }
}
