import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const uploadAction = httpAction(async (ctx, request) => {
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get("uuid");
  if (uuid === null) {
    return new Response("Missing uuid query param", {
      status: 400,
    });
  }
  const storageId = await ctx.runQuery(internal.serve.getByUuid, { uuid });
  if (storageId === null) {
    // invalid UUID or expired URL
    return new Response("File Not Found", {
      status: 404,
    });
  }
  const blob = await ctx.storage.get(storageId);
  if (blob === null) {
    // Valid UUID but pointing at nonexistent file
    console.log(`UUID ${uuid} points at missing file`);
    return new Response("File Not Found", {
      status: 404,
    });
  }
  return new Response(blob);
});
