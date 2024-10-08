import {
  action,
  httpAction,
  internalMutation,
  internalQuery,
  mutation,
} from "./_generated/server";
import { v4 as uuidv4 } from "uuid";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { PublicHttpAction } from "convex/server";

export const serveHttpAction = (component: any): PublicHttpAction => {
  return httpAction(async (ctx, request) => {
    const { searchParams } = new URL(request.url);
    const uuid = searchParams.get("uuid");
    if (uuid === null) {
      return new Response("Missing uuid query param", {
        status: 400,
      });
    }
    const blob = await ctx.runAction(component.serve.serveAction, { uuid });
    if (blob === null) {
      return new Response("File Not Found", {
        status: 404,
      });
    }
    return new Response(blob);
  });
};

export const serveAction = action({
  args: {
    uuid: v.string(),
  },
  returns: v.union(v.bytes(), v.null()),
  handler: async (ctx, { uuid }): Promise<ArrayBuffer | null> => {
    const storageId = await ctx.runQuery(internal.serve.getByUuid, { uuid });
    if (storageId === null) {
      // invalid UUID or expired URL
      return null;
    }
    const blob = await ctx.storage.get(storageId);
    if (blob === null) {
      // Valid UUID but pointing at nonexistent file
      console.log(`UUID ${uuid} points at missing file`);
      return null;
    }
    return await blob.arrayBuffer();
  },
});

export const getByUuid = internalQuery({
  args: {
    uuid: v.string(),
  },
  returns: v.union(v.null(), v.id("_storage")),
  handler: async (ctx, args) => {
    const doc = await ctx.db
      .query("serveUrls")
      .withIndex("by_uuid", (q) => q.eq("uuid", args.uuid))
      .unique();
    if (doc === null) {
      console.log(`Serve UUID ${args.uuid} is invalid`);
      return null;
    }
    if (doc.expiration && doc.expiration < Date.now()) {
      console.log(`Serve UUID ${args.uuid} has expired`);
      return null;
    }
    return doc.storageId;
  },
});

export const generateUrl = mutation({
  args: {
    storageId: v.id("_storage"),
    expiresInMillis: v.union(v.null(), v.float64()),
    convexSiteUrl: v.string(),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    const uuid = uuidv4();
    const expiration = args.expiresInMillis
      ? Date.now() + args.expiresInMillis
      : null;
    await ctx.db.insert("serveUrls", {
      uuid,
      storageId: args.storageId,
      expiration,
    });
    return `${args.convexSiteUrl}/fileStorageUrls/get?uuid=${uuid}`;
  },
});

export const cleanup = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const now = Date.now();
    const expired = await ctx.db
      .query("serveUrls")
      .withIndex("by_expiration", (q) =>
        q.gt("expiration", null).lt("expiration", now),
      )
      .collect();
    for (const { _id, uuid, storageId } of expired) {
      console.log(`Cleaning up ${uuid} -> ${storageId}`);
      await ctx.db.delete(_id);
    }
  },
});
