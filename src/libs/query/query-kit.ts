/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type CompatibleError,
  createInfiniteQuery,
  createMutation,
  createQuery,
  createSuspenseInfiniteQuery,
  createSuspenseQuery,
  type ResolvedRouterInfiniteQuery,
  type ResolvedRouterMutation,
  type ResolvedRouterQuery,
  type RouterInfiniteQuery,
  type RouterInfiniteQueryOptions,
  type RouterMutation,
  type RouterMutationOptions,
  type RouterQuery,
  type RouterQueryOptions,
} from "react-query-kit";
import { z } from "zod";
import type { QueryKey } from "@tanstack/react-query";
import { stripNull, stripUndefined } from "../helpers";

// Endpoint Builder
interface EndpointSchema<Schema extends z.ZodTypeAny> {
  payload: Schema;
  response: Schema;
}

type QueryEndpoint = RouterQuery<any, any, any> & { schema: any };
type InfiniteQueryEndpoint = RouterInfiniteQuery<any, any, any> & {
  schema: any;
};
type MutationEndpoint = RouterMutation<any, any, any, any> & { schema: any };

interface EndpointConfig {
  [k: string]:
    | QueryEndpoint
    | InfiniteQueryEndpoint
    | MutationEndpoint
    | EndpointConfig;
}

/**
 * `router` implementation that includes a zod schema for reuse and type safety.
 *
 * Https://github.com/HuolalaTech/react-query-kit/blob/main/src/router.ts.
 */
const buildEndpoints = (keys: QueryKey, config: EndpointConfig) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Object.entries(config).reduce<any>(
    (acc, [key, opts]) => {
      // eslint-disable-next-line no-negated-condition, @typescript-eslint/no-unnecessary-condition
      if (!opts._type) {
        acc[key] = buildEndpoints([...keys, key], opts);
      } else {
        const options: any = {
          ...opts,
          [opts._type === `m` ? `mutationKey` : `queryKey`]: [...keys, key],
        };

        acc[key] =
          opts._type === `m`
            ? {
                schema: opts.schema,
                useMutation: createMutation(options),
                ...createMutation(options),
              }
            : opts._type === `q`
              ? {
                  schema: opts.schema,
                  useQuery: createQuery(options),
                  useSuspenseQuery: createSuspenseQuery(options),
                  ...createQuery(options),
                }
              : {
                  schema: opts.schema,
                  useInfiniteQuery: createInfiniteQuery(options),
                  useSuspenseInfiniteQuery:
                    createSuspenseInfiniteQuery(options),
                  ...createInfiniteQuery(options),
                };
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return acc;
    },
    {
      getKey: () => keys,
    }
  );
};

type DefaultTo<T, D> = unknown extends T ? D : T;
type CreatEndpoints<TConfig extends EndpointConfig> = {
  [K in keyof TConfig]: TConfig[K] extends RouterMutation<
    infer TFnData,
    infer TVariables,
    infer TError,
    infer TContext
  > & { schema: infer TSchema }
    ? ResolvedRouterMutation<
        TFnData,
        DefaultTo<TVariables, void>,
        DefaultTo<TError, CompatibleError>,
        TContext
      > & { schema: TSchema }
    : TConfig[K] extends RouterInfiniteQuery<
          infer TFnData,
          infer TVariables,
          infer TError
        > & { schema: infer TSchema }
      ? ResolvedRouterInfiniteQuery<
          TFnData,
          DefaultTo<TVariables, void>,
          DefaultTo<TError, CompatibleError>
        > & { schema: TSchema }
      : TConfig[K] extends RouterQuery<
            infer TFnData,
            infer TVariables,
            infer TError
          > & { schema: infer TSchema }
        ? ResolvedRouterQuery<
            TFnData,
            DefaultTo<TVariables, void>,
            DefaultTo<TError, CompatibleError>
          > & { schema: TSchema }
        : TConfig[K] extends EndpointConfig
          ? CreatEndpoints<TConfig[K]>
          : never;
} & {
  getKey: () => QueryKey;
};

export const builder = <TConfig extends EndpointConfig>(
  key: string | QueryKey,
  config: TConfig
): CreatEndpoints<TConfig> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return buildEndpoints(Array.isArray(key) ? key : [key], config);
};

function query<
  Shape extends z.ZodTypeAny,
  Schema extends EndpointSchema<Shape>,
  TError = CompatibleError,
>(
  schema: Schema,
  options:
    | ((
        args: Schema
      ) => RouterQueryOptions<
        z.infer<Schema["response"]>,
        z.input<Schema["payload"]>,
        TError
      >)
    | RouterQueryOptions<
        z.infer<Schema["response"]>,
        z.input<Schema["payload"]>,
        TError
      >
) {
  const resolvedOptions =
    typeof options === "function" ? options(schema) : options;

  // Add validation wrapper if payload schema exists and fetcher is defined
  if (schema.payload && resolvedOptions.fetcher) {
    const configuredFetcher = resolvedOptions.fetcher;
    resolvedOptions.fetcher = (
      payload: unknown,
      ctx: Parameters<typeof resolvedOptions.fetcher>[1]
    ) => {
      // Validate payload before calling original fetcher
      const result = schema.payload.safeParse(payload);
      if (!result.success) {
        throw new Response(JSON.stringify(result.error), {
          status: 400,
          statusText: "Validation Error",
        });
      }
      return configuredFetcher(result.data, ctx);
    };
  }

  return {
    ...resolvedOptions,
    _type: "q",
    schema,
  } as RouterQuery<
    z.infer<Schema["response"]>,
    z.input<Schema["payload"]>,
    TError
  > & { schema: Schema };
}

function infiniteQuery<
  Shape extends z.ZodTypeAny,
  Schema extends EndpointSchema<Shape>,
  TError = CompatibleError,
  TPageParam = number,
>(
  schema: Schema,
  options:
    | ((
        args: Schema
      ) => RouterInfiniteQueryOptions<
        z.infer<Schema["response"]>,
        z.input<Schema["payload"]>,
        TError,
        TPageParam
      >)
    | RouterInfiniteQueryOptions<
        z.infer<Schema["response"]>,
        z.input<Schema["payload"]>,
        TError,
        TPageParam
      >
) {
  const resolvedOptions =
    typeof options === "function" ? options(schema) : options;

  // Add validation wrapper if payload schema exists and fetcher is defined
  if (schema.payload && resolvedOptions.fetcher) {
    const configuredFetcher = resolvedOptions.fetcher;
    resolvedOptions.fetcher = (
      payload: unknown,
      ctx: Parameters<typeof resolvedOptions.fetcher>[1]
    ) => {
      // Validate payload before calling original fetcher
      const result = schema.payload.safeParse(payload);
      if (!result.success) {
        throw new Response(JSON.stringify(result.error), {
          status: 400,
          statusText: "Validation Error",
        });
      }
      return configuredFetcher(result.data, ctx);
    };
  }

  return { ...resolvedOptions, _type: "inf", schema } as RouterInfiniteQuery<
    z.infer<Schema["response"]>,
    z.input<Schema["payload"]>,
    TError,
    TPageParam
  > & { schema: Schema };
}

function mutation<
  Shape extends z.ZodTypeAny,
  Schema extends EndpointSchema<Shape>,
  TError = CompatibleError,
  TContext = unknown,
>(
  schema: Schema,
  options:
    | ((
        args: Schema
      ) => RouterMutationOptions<
        z.infer<Schema["response"]>,
        z.input<Schema["payload"]>,
        TError,
        TContext
      >)
    | RouterMutationOptions<
        z.infer<Schema["response"]>,
        z.input<Schema["payload"]>,
        TError,
        TContext
      >
) {
  const resolvedOptions =
    typeof options === "function" ? options(schema) : options;

  // Add validation wrapper if payload schema exists and mutationFn is defined
  if (schema.payload && resolvedOptions.mutationFn) {
    const configuredFetcher = resolvedOptions.mutationFn;
    resolvedOptions.mutationFn = (payload: unknown) => {
      // Validate payload before calling original fetcher
      const result = schema.payload.safeParse(payload);
      if (!result.success) {
        throw new Response(JSON.stringify(result.error), {
          status: 400,
          statusText: "Validation Error",
        });
      }
      return configuredFetcher(result.data);
    };
  }

  return { ...resolvedOptions, _type: "m", schema } as RouterMutation<
    z.infer<Schema["response"]>,
    z.input<Schema["payload"]>,
    TError,
    TContext
  > & { schema: Schema };
}

builder.query = query;
builder.infiniteQuery = infiniteQuery;
builder.mutation = mutation;

/**
 * Query Params helpers.
 */
export const toQueryParams = (
  rawParams: Record<string, any>,
  options?: {
    stripNull?: boolean;
  }
) => {
  const { stripNull: shouldStripNull = true } = options ?? {};
  let parsed = stripUndefined(rawParams);

  if (shouldStripNull) {
    parsed = stripNull(parsed);
  }

  return parsed;
};

// Pagination helpers
export const paginationMetaSchema = z.object({
  count: z.coerce.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  hasNext: z.boolean().optional().default(false),
  hasPrevious: z.boolean().optional().default(false),
});

export const withPaginationSchema = <Schema extends z.ZodTypeAny>(
  schema: Schema
) => {
  return paginationMetaSchema
    .transform((values) => {
      return {
        ...values,
        hasNext: values.next !== null,
        hasPrevious: values.previous !== null,
      };
    })
    .and(z.object({ results: schema.array() }));
};

export const parsePaginatedResponse = <Schema extends z.ZodTypeAny>(
  schema: Schema,
  data: unknown
) => {
  return withPaginationSchema(schema).parse(data);
};

export const paginatedParamsSchema = z.object({ page: z.number() });
export type PaginatedResponse<Data> = z.infer<typeof paginationMetaSchema> & {
  results: Array<Data>;
};
