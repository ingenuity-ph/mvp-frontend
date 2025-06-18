import type { Wretch, WretchAddon } from "wretch";

export interface AuthenticatedRequestAddon {
  /**
   * Sets the `credentials` option to `include` for requests requiring auth.
   */
  authenticate: <T extends AuthenticatedRequestAddon, C, R>(
    this: T & Wretch<T, C, R>
  ) => this;
}

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
  wretch: {
    authenticate() {
      return this.options({ credentials: "include" });
    },
  },
};
