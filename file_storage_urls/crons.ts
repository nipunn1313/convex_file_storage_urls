import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "clear messages table",
  { minutes: 5 }, // every 5 minutes
  internal.serve.cleanup,
);

export default crons;
