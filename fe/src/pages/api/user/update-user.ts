import api from "@/lib/api.lib";
import responseCreator from "@/utils/response-creator";
import type { APIRoute } from "astro";

export const PATCH: APIRoute = async (context) => {
  return await responseCreator({
    body: true,
    context,
    success: async ({ body }) => {
      const { public_id, data: updatedData } = body;
      const { data } = await api(
        { url: `/user/${public_id}`, data: updatedData, method: "PATCH" },
        { accessToken: context.locals.accessToken },
      );
      return {
        payload: data,
      };
    },
  });
};
