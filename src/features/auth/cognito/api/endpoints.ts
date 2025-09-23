import { z } from "zod";
import { api } from "@/libs/api/api";
import { builder } from "@/libs/query/query-kit";

const baseQueryKey = "auth" as const;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CognitoAuthService = builder(baseQueryKey, {
  validateToken: builder.mutation(
    {
      payload: z.object({
        token: z.string(),
      }),
      response: z.unknown(),
    },
    () => {
      return {
        mutationFn: (payload) => api.post(payload, "/validate-token"),
      };
    },
  ),
});
