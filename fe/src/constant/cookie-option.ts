import type { AstroCookieSetOptions } from "astro";

export const authCookieOption: AstroCookieSetOptions = {
  sameSite: "strict",
  path: "/",
  httpOnly: true,
};
