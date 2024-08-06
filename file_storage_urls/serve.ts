import { httpAction } from "./_generated/server";

export const serveAction = httpAction(async (_ctx, _request) => {
  const { searchParams } = new URL(request.url);
  // This storageId param should be an Id<"_storage">
  const storageId = searchParams.get("storageId")!;
  const blob = await ctx.storage.get(storageId);
  if (blob === null) {
    return new Response("Nada nono cannot IMAGEine this file", {
      status: 404,
    });
  }
});
