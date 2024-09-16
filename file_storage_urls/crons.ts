import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "clear messages table",
  { minutes: 5 }, // every 5 minutes
  api.serve.cleanup,
);

export default crons;
