import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { components } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("messages").collect();
  },
});

export const getImageUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    let url = await ctx.runMutation(
      components.fileStorageUrls.serve.generateUrl,
      {
        expiresInMillis: 60000, // lasts a minute
        storageId: args.storageId,
      },
    );
    console.log(url);
    return url;
  },
});

export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async (ctx, { body, author }) => {
    await ctx.db.insert("messages", { body, author, format: "text" });
  },
});

export const sendImage = mutation({
  args: { storageId: v.id("_storage"), author: v.string() },
  handler: async (ctx, { storageId, author }) => {
    await ctx.db.insert("messages", {
      author,
      format: "image",
      storageId,
    });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.runMutation(
      components.fileStorageUrls.upload.generateUploadUrl,
    );
  },
});
