import api from "@/lib/api.lib";
import responseCreator from "@/utils/response-creator";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  return await responseCreator({
    body: false,
    context,
    success: async () => {
      const { data } = await api(
        {
          url: "/journal/byLessonPublicId/d6c63e54-3db7-479c-9dca-6d333e778fbd",
          method: "GET",
        },
        {
          accessToken: context.locals.accessToken,
        },
      );
      return {
        payload: data,
      };
    },
  });
};
