/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as domains_habits_mutations_create from "../domains/habits/mutations/create.js";
import type * as domains_habits_mutations_toggle_completion from "../domains/habits/mutations/toggle_completion.js";
import type * as domains_habits_queries_completions_for_date_range from "../domains/habits/queries/completions_for_date_range.js";
import type * as domains_habits_queries_list from "../domains/habits/queries/list.js";
import type * as http from "../http.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "domains/habits/mutations/create": typeof domains_habits_mutations_create;
  "domains/habits/mutations/toggle_completion": typeof domains_habits_mutations_toggle_completion;
  "domains/habits/queries/completions_for_date_range": typeof domains_habits_queries_completions_for_date_range;
  "domains/habits/queries/list": typeof domains_habits_queries_list;
  http: typeof http;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("@convex-dev/better-auth/_generated/component.js").ComponentApi<"betterAuth">;
};
