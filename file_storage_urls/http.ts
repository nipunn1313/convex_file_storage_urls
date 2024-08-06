import { httpRouter } from "convex/server";
import { serveAction } from "./serve";

const http = httpRouter();

http.route({
  path: "/get",
  method: "GET",
  handler: serveAction,
});

export default http;
