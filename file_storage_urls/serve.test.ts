import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";
import { MutationCtx } from "./_generated/server";

test("Serve File", async () => {
  const t = convexTest(schema, modules);
  const storageId = await t.run(async (ctx) => {
    return await ctx.storage.store(new Blob(["HI"]));
  });
  const uuid = await t.mutation(api.serve.generateUrl, {
    storageId,
    expiresInMillis: null,
  });
  expect(uuid).toBeDefined();

  const response = await t.fetch(`/get?uuid=${uuid}`, { method: "GET" });
  expect(response.status).toEqual(200);
  const contents = await response.text();
  expect(contents).toEqual("HI");
});

test("Serve file expires", async () => {
  const t = convexTest(schema, modules);
  const storageId = await t.run(async (ctx) => {
    return await ctx.storage.store(new Blob(["HI"]));
  });
  const uuid = await t.mutation(api.serve.generateUrl, {
    storageId,
    expiresInMillis: 100,
  });
  expect(uuid).toBeDefined();

  await new Promise((r) => setTimeout(r, 100));
  const response = await t.fetch(`/get?uuid=${uuid}`, { method: "GET" });
  expect(response.status).toEqual(404);
  const contents = await response.text();
  expect(contents).toEqual("File Not Found");
});

test("Cleanup", async () => {
  const t = convexTest(schema, modules);
  const storageId = await t.run(async (ctx) => {
    return await ctx.storage.store(new Blob(["HI"]));
  });

  const getNumUrls = async (ctx: MutationCtx) => {
    const urls = await ctx.db.query("urls").collect();
    return urls.length;
  };
  expect(await t.run(getNumUrls)).toEqual(0);

  const uuid = await t.mutation(api.serve.generateUrl, {
    storageId,
    expiresInMillis: 100,
  });
  expect(uuid).toBeDefined();
  expect(await t.run(getNumUrls)).toEqual(1);

  // Cleanup does nothing at first
  await t.mutation(internal.serve.cleanup);
  expect(await t.run(getNumUrls)).toEqual(1);

  // After 100ms, cleanup happens
  await new Promise((r) => setTimeout(r, 100));
  expect(await t.run(getNumUrls)).toEqual(1);
  await t.mutation(internal.serve.cleanup);
  expect(await t.run(getNumUrls)).toEqual(0);
});
