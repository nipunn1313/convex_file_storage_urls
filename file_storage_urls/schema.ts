import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  serveUrls: defineTable({
    uuid: v.string(),
    storageId: v.id("_storage"),
    expiration: v.union(v.null(), v.float64()), // expiration in UTC
  })
    .index("by_uuid", ["uuid"])
    .index("by_expiration", ["expiration"]),
  uploadUrls: defineTable({
    uuid: v.string(),
    expiration: v.union(v.null(), v.float64()), // expiration in UTC
  })
    .index("by_uuid", ["uuid"])
    .index("by_expiration", ["expiration"]),
});
