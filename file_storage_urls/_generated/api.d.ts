/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as crons from "../crons.js";
import type * as serve from "../serve.js";
import type * as upload from "../upload.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  crons: typeof crons;
  serve: typeof serve;
  upload: typeof upload;
}>;
export type Mounts = {
  serve: {
    generateUrl: FunctionReference<
      "mutation",
      "public",
      {
        convexSiteUrl: string;
        expiresInMillis: null | number;
        storageId: string;
      },
      string
    >;
    serveAction: FunctionReference<
      "action",
      "public",
      { uuid: string },
      ArrayBuffer | null
    >;
  };
  upload: {
    generateUploadUrl: FunctionReference<
      "mutation",
      "public",
      { convexSiteUrl: string; expiresInMillis: null | number },
      string
    >;
    uploadAction: FunctionReference<
      "action",
      "public",
      { buf: ArrayBuffer; uuid: string },
      null
    >;
  };
};
// For now fullApiWithMounts is only fullApi which provides
// jump-to-definition in component client code.
// Use Mounts for the same type without the inference.
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
