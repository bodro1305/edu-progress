import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
import icon from "astro-icon";
import node from "@astrojs/node";

export default defineConfig({
  integrations: [tailwind(), alpinejs(), icon()],
  output: "server",
  redirects: {
    "/dashboard": "/dashboard/home",
    "/admin": "/admin/home",
    "/": "/login",
  },
  adapter: node({
    mode: "standalone",
  }),
  server: {
    host: "0.0.0.0",
  },
});
