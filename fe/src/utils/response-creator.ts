import type { APIContext } from "astro";
import { AxiosError } from "axios";

const parseRequestBody = async (request: Request): Promise<any | null> => {
  const contentType = request.headers.get("Content-Type");
  if (contentType !== "application/json") {
    return null;
  }

  try {
    return await request.json();
  } catch (error) {
    return null;
  }
};

const response = (data: any, opt?: ResponseInit) => {
  return new Response(JSON.stringify(data), opt);
};

interface SuccessProps {
  body: any;
}

interface ResponseCreatorProps {
  context: APIContext;
  body: boolean;
  success: (props: SuccessProps) => Promise<any>;
}

const responseCreator = async (props: ResponseCreatorProps) => {
  let body: any;

  try {
    if (props.body) {
      body = await parseRequestBody(props.context.request);

      if (!body) {
        return response(
          {
            message: ["INVALID_BODY"],
            status: 400,
            error: "Bad Request",
          },
          {
            status: 400,
          },
        );
      }
    }
    const { payload } = await props.success({ body });
    return new Response(JSON.stringify(payload));
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return response(error.response?.data, {
        status: error.status,
      });
    }
    return response(
      {
        status: 500,
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
};

export default responseCreator;
