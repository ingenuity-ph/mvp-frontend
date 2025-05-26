import type { Config, ConfiguredMiddleware, Wretch, WretchAddon } from "wretch";

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
      opts.credentials = "include";

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
export const authenticatedRequest: WretchAddon<AuthenticatedRequestAddon> = {
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
