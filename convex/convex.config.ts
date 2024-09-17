import { defineApp } from "convex/server";
import fileStorageUrls from "../file_storage_urls/convex.config";

const app = defineApp();

app.use(fileStorageUrls);

export default app;
