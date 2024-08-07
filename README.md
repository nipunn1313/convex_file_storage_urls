# File Storage URLs Component

Convex component for serving files from time-limited URLs.

In your `convex/app.config.ts`

```typescript
const c = app.install(fileStorageUrls, { args: {} });
app.mountHttp("/storage/", c);
```

This will export a `generateUrl` mutation with args `{storageId: Id<"_storage">, expiresInMillis: number}`
It will mount an endpoint `/storage/get` which will fetch the URL, but enforce expiration.

It is implemented with a table that is cleaned up automatically via a cron.

Tests are in file_storage_urls/serve.test.ts
