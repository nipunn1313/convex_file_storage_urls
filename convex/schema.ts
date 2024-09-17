import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  messages: defineTable(
    v.union(
      v.object({
        author: v.string(),
        format: v.literal("image"),
        storageId: v.id("_storage"),
      }),
      v.object({
        author: v.string(),
        format: v.literal("text"),
        body: v.string(),
      }),
    ),
  ),
});
