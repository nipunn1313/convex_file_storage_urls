import { httpRouter } from "convex/server";
import { serveAction } from "../file_storage_urls/serve";
import { components } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/fileStorageUrls/get",
  method: "GET",
  handler: serveAction(components.fileStorageUrls),
});

export default http;
