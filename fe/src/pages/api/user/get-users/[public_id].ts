import api from "@/lib/api.lib";
import responseCreator from "@/utils/response-creator";
import type { APIRoute } from "astro";

export const POST: APIRoute = async (context) => {
  return await responseCreator({
    body: false,
    context,
    success: async () => {
      const { public_id } = context.params;
      const { data } = await api(
        {
          url: `/user/${public_id}`,
          method: "GET",
        },
        { accessToken: context.locals.accessToken },
      );

      return {
        payload: data,
      };
    },
  });
};
