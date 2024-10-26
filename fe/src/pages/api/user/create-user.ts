import api from "@/lib/api.lib";
import responseCreator from "@/utils/response-creator";
import type { APIRoute } from "astro";

export const POST: APIRoute = async (context) => {
  return await responseCreator({
    body: true,
    context,
    success: async ({ body }) => {
      const { data } = await api(
        {
          url: "/user",
          method: "POST",
          data: body,
        },
        { accessToken: context.locals.accessToken },
      );

      return {
        payload: data,
      };
    },
  });
};
