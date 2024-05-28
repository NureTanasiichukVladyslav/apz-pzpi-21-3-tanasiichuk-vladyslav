import { FetchError } from "./errors";
import type { RequestOptions } from "./types";

const baseFetch = async <T>(
  resource: string,
  requestOptions: RequestOptions
): Promise<T | never | undefined> => {
  const { accessToken: _accessToken, config: customConfig } = requestOptions;

  let serverCookies;

  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    serverCookies = cookies();
  }

  const config: RequestInit = {
    credentials: "include",
    ...customConfig,

    headers: {
      "Content-Type": "application/json",
      ...(serverCookies && { Cookie: serverCookies.toString() }),
      ...customConfig?.headers,
    },
  };

  const url = `http://localhost:3000/${resource.replace(/^\/+|\/+$/g, "")}`;

  const response = await fetch(url, config);
  const responseText = await response.text();

  try {
    if (response.ok) {
      return responseText ? JSON.parse(responseText) : {};
    }

    const responseBody = JSON.parse(responseText);
    throw new FetchError(
      responseBody.message ||
        "Error parsing fetch response - No response message",
      {
        method: config.method as string,
        status: responseBody.statusCode || response.status,
        url,
      }
    );
  } catch (error) {
    throw error;
  }
};

const get = async <T>(resource: string, requestOptions?: RequestOptions) =>
  baseFetch<T>(resource, {
    ...requestOptions,
    config: {
      ...requestOptions?.config,
      method: "GET",
    },
  });

const post = async <T = void>(
  resource: string,
  body?: Record<string, any>,
  requestOptions?: RequestOptions
) =>
  baseFetch<T>(resource, {
    ...requestOptions,
    config: {
      ...requestOptions?.config,
      method: "POST",
      body: body && JSON.stringify(body),
    },
  });

const put = async <T = void>(
  resource: string,
  body?: Record<string, any>,
  requestOptions?: RequestOptions
) =>
  baseFetch<T>(resource, {
    ...requestOptions,
    config: {
      ...requestOptions?.config,
      method: "PUT",
      body: body && JSON.stringify(body),
    },
  });

const delete$ = async <T = void>(
  resource: string,
  requestOptions?: RequestOptions
) =>
  baseFetch<T>(resource, {
    ...requestOptions,
    config: {
      ...requestOptions?.config,
      method: "DELETE",
    },
  });

export const fetchClient = {
  get,
  post,
  put,
  delete$,
};
