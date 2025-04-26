import type { z } from "zod";
import { type LinkProps, redirect } from "@tanstack/react-router";

export const ensureParams = <Schema extends z.ZodTypeAny>({
  schema,
  params,
  redirectTo,
}: {
  schema: Schema;
  params: unknown;
  redirectTo: LinkProps["to"];
}) => {
  const parsed = schema.safeParse(params);

  if (!parsed.success) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: redirectTo });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return parsed.data as z.infer<Schema>;
};
