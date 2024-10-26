import api from "@/lib/api.lib";
import responseCreator from "@/utils/response-creator";
import type { APIRoute } from "astro";

export const POST: APIRoute = async (context) => {
  return await responseCreator({
    body: true,
    context,
    success: async ({ body }) => {
      const dataPost = {
        ...body,
      };
      if (!body.filled_by_public_id) {
        dataPost.filled_by_public_id = context.locals.user.public_id;
      }
      const { data } = await api(
        {
          url: "/journal",
          data: dataPost,
          method: "POST",
        },
        { accessToken: context.locals.accessToken },
      );

      return {
        payload: data,
      };
    },
  });
};
