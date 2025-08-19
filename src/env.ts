import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "VITE_",

  client: {
    VITE_API_URL: z.string().min(1),
    VITE_COGNITO_POOL_ID: z.string().min(1),
    VITE_COGNITO_CLIENT_ID: z.string().min(1),
    VITE_COGNITO_DOMAIN: z.string().min(1),
    VITE_PUBLIC_POSTHOG_KEY: z.string().optional(),
    VITE_PUBLIC_POSTHOG_HOST: z.string().optional(),
    VITE_SENTRY_DSN: z.string().optional(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: import.meta.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
