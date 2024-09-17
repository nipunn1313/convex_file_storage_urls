import { httpRouter } from "convex/server";
import { serveHttpAction } from "../file_storage_urls/serve";
import { components } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/fileStorageUrls/get",
  method: "GET",
  handler: serveHttpAction(components.fileStorageUrls),
});

export default http;
