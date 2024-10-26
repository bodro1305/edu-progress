import responseCreator from "@/utils/response-creator";
import api from "@/lib/api.lib";
import { authCookieOption } from "@/constant/cookie-option";
import type { APIRoute } from "astro";

export const POST: APIRoute = async (context) => {
  return await responseCreator({
    context,
    body: true,
    success: async ({ body }) => {
      const { data } = await api(
        {
          url: "/auth/login",
          data: body,
          method: "POST",
        },
        {},
      );
      context.cookies.set(
        "accessToken",
        data.data.accessToken,
        authCookieOption,
      );
      return {
        payload: data,
      };
    },
  });
};
