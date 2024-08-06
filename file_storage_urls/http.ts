import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/get",
  method: "GET",
  handler: httpAction(async (_ctx, _request) => {
    return new Response("Image not found", {
      status: 404,
    });
  }),
});

export default http;
