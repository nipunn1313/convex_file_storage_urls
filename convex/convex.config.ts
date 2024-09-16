import { defineApp } from "convex/server";
import fileStorageUrls from "../file_storage_urls/component.config";

const app = defineApp();

const c = app.install(fileStorageUrls, { args: {} });
app.mountHttp("/storage/", c);

export default app;
