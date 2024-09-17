import { httpRouter } from "convex/server";
import { serveHttpAction } from "../file_storage_urls/serve";
import { components, httpAction } from "./_generated/server";
import { uploadHttpAction } from "../file_storage_urls/upload";

const http = httpRouter();

http.route({
  path: "/fileStorageUrls/get",
  method: "GET",
  handler: serveHttpAction(components.fileStorageUrls),
});
http.route({
  path: "/fileStorageUrls/upload",
  method: "POST",
  handler: uploadHttpAction(components.fileStorageUrls),
});

// Pre-flight request for /sendImage
http.route({
  path: "/fileStorageUrls/upload",
  method: "OPTIONS",
  handler: httpAction(async (_ctx, request) => {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          // e.g. https://mywebsite.com, configured on your Convex dashboard
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Digest",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

export default http;
