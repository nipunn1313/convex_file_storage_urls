import { cronJobs } from "convex/server";
import { functions } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "clear messages table",
  { minutes: 5 }, // every 5 minutes
  functions.serve.cleanup,
);

export default crons;
