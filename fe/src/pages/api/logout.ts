import { authCookieOption } from "@/constant/cookie-option";
import responseCreator from "@/utils/response-creator";
import type { APIRoute } from "astro";

export const DELETE: APIRoute = (context) => {
  return responseCreator({
    body: false,
    context,
    success: async () => {
      context.cookies.delete("accessToken", authCookieOption);
      return {
        payload: {
          status: 200,
          message: ["LOGOUT_SUCCESS"],
        },
      };
    },
  });
};
