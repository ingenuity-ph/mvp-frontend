import wretch, {
  type Config,
  type ConfiguredMiddleware,
  type FetchLike,
  type Wretch,
  type WretchAddon,
} from "wretch";
// eslint-disable-next-line @typescript-eslint/naming-convention, import/no-named-as-default
import FormDataAddon from "wretch/addons/formData";
// eslint-disable-next-line @typescript-eslint/naming-convention, import/no-named-as-default
import QueryStringAddon from "wretch/addons/queryString";
import { z } from "zod";
import { env } from "@/env";

export const API_URL = env.VITE_API_URL || "http://localhost:9000";

export interface AuthenticatedRequestAddon {
  /**
   * Sets the `credentials` option to `include` for requests requiring auth.
   */
  authenticate: <T extends AuthenticatedRequestAddon, C, R>(
    this: T & Wretch<T, C, R>
  ) => this;
}

const makeAuthenticatedAuthMiddleware: (
  config: Config
) => ConfiguredMiddleware = () => {
  return (next) => {
    return (url, opts) => {
      // opts.credentials = "include";

      return next(url, opts);
    };
  };
};

/**
 * Adds the ability to use basic auth with the `Authorization` header.
 *
 * ```js
 * import BasicAuthAddon from "wretch/addons/basicAuth"
 *
 * wretch().addon(BasicAuthAddon)
 * ```
 */
const authenticatedRequest: WretchAddon<AuthenticatedRequestAddon> = {
  beforeRequest(wr) {
    // eslint-disable-next-line sonarjs/no-extra-arguments
    return wr.middlewares([makeAuthenticatedAuthMiddleware(wr._config)]);
  },
  wretch: {
    authenticate() {
      return this.authenticate();
    },
  },
};

const authenticatedRequestMiddleware = (next: FetchLike): FetchLike => {
  return async (url, opts) => {
    if (opts.method?.toLowerCase() === "post") {
      const formData =
        opts.body instanceof FormData ? opts.body : new FormData();

      opts.body = formData;
    }

    return next(url, opts);
  };
};

const extractErrorMessage = (r: unknown) => {
  const messageKeySchema = z.object({ message: z.string() });
  const messageKey = messageKeySchema.safeParse(r);

  if (messageKey.success) {
    return messageKey.data.message;
  }
  const errorKeySchema = z.object({ error: z.string() });
  const errorKey = errorKeySchema.safeParse(r);

  if (errorKey.success) {
    return errorKey.data.error;
  }

  const errorsKey = z
    .object({ errors: z.string().array().min(1) })
    .safeParse(r);

  if (errorsKey.success) {
    return errorsKey.data.errors[0];
  }

  return "";
};

const ensureResponseWithoutError = (r: unknown) => {
  const hasError = z
    .object({ error: z.string() })
    .or(z.object({ errors: z.string().array() }))
    .safeParse(r);

  if (hasError.success) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response(null, {
      status: 400,
      statusText: extractErrorMessage(r),
    });
  }
};

// Instantiate and configure wretch
export const baseAPI = wretch(API_URL)
  .middlewares([authenticatedRequestMiddleware])
  .addon(QueryStringAddon)
  .addon(FormDataAddon)
  .addon(authenticatedRequest);

export const api = baseAPI
  .catcherFallback((err) => {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response(null, {
      status: err.status,
      statusText: extractErrorMessage(err.json),
    });
  })
  .resolve(async (r) => {
    const response = await r.json();

    // Catcher here to ensure 200 status does not contain `error` or `message` keys
    ensureResponseWithoutError(response);

    return response;
  });
