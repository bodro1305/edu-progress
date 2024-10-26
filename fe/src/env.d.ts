/// <reference path="../.astro/types.d.ts" />
interface Window {
  Alpine: import("alpinejs").Alpine;
}

declare namespace App {
  interface Locals extends Record<string, any> {
    user: any;
    accessToken: string;
  }
}
