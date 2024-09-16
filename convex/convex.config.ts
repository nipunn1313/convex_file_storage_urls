import { defineApp } from "convex/server";
import fileStorageUrls from "../file_storage_urls/convex.config";

const components = defineApp();

components.use(fileStorageUrls, { args: {} });

export default components;
