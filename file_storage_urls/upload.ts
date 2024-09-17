import { PublicHttpAction } from "convex/server";
import {
  action,
  httpAction,
  internalQuery,
  mutation,
} from "./_generated/server";
import { v4 as uuidv4 } from "uuid";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const uploadHttpAction = (_component: any): PublicHttpAction => {
  return httpAction(async (_ctx, request) => {
    const { searchParams } = new URL(request.url);
    const uuid = searchParams.get("uuid");
    if (uuid === null) {
      return new Response("Missing uuid query param", {
        status: 400,
      });
    }
    const blob = await request.blob();
    const buf = await blob.arrayBuffer();

    return new Response("TODO", {
      status: 500,
      headers: new Headers({
        // e.g. https://mywebsite.com, configured on your Convex dashboard
        "Access-Control-Allow-Origin": "*",
        Vary: "origin",
      }),
    });
  });
};

export const uploadAction = action({
  args: {
    uuid: v.string(),
    buf: v.bytes(),
  },
  returns: v.null(),
  handler: async (ctx, { uuid, buf }) => {
    const valid = await ctx.runQuery(internal.upload.validateUploadByUuid, {
      uuid,
    });
    if (!valid) {
      return null;
    }

    ctx.storage.store(blob);
  },
});

export const validateUploadByUuid = internalQuery({
  args: {
    uuid: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, { uuid }) => {
    const doc = await ctx.db
      .query("uploadUrls")
      .withIndex("by_uuid", (q) => q.eq("uuid", uuid))
      .unique();
    if (doc === null) {
      console.log(`Upload UUID ${uuid} is invalid`);
      return false;
    }
    if (doc.expiration && doc.expiration < Date.now()) {
      console.log(`Upload UUID ${uuid} has expired`);
      return false;
    }
    return true;
  },
});

export const generateUploadUrl = mutation({
  args: {
    expiresInMillis: v.union(v.null(), v.float64()),
    convexSiteUrl: v.string(),
  },
  returns: v.string(),
  handler: async (ctx, { expiresInMillis, convexSiteUrl }) => {
    const uuid = uuidv4();
    const expiration = expiresInMillis ? Date.now() + expiresInMillis : null;
    await ctx.db.insert("uploadUrls", {
      uuid,
      expiration,
    });
    return `${convexSiteUrl}/fileStorageUrls/upload?uuid=${uuid}`;
  },
});
