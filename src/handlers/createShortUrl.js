import { generateUniqueUrlKey } from '../utils/urlKey'

/*
Generates a short URL given an original URL.

Creates a new `urlKey: originalUrl` key-value pair in KV.

Example:

```sh
$ curl --request POST \
  --url http://yourdomain.com/api/url \
  --header 'Content-Type: application/json' \
  --data '{
	"originalUrl": "https://jerrynsh.com/how-to-build-a-pastebin-clone-for-free/"
}'
```

JSON Response:
```json
{
	"urlKey": "IgWKmlXD",
	"shortUrl": "https://yourdomain.com/IgWKmlXD",
	"originalUrl": "https://jerrynsh.com/how-to-build-a-pastebin-clone-for-free/"
}
```
*/
export const createShortUrl = async (request, env, ctx) => {
    try {
        const urlKey = await generateUniqueUrlKey(env.URL_DB)

        const { host } = new URL(request.url)
        const shortUrl = `https://${host}/${urlKey}`

        const { originalUrl } = await request.json()
        const response = new Response(
            JSON.stringify({
                urlKey,
                shortUrl,
                originalUrl,
            }),
            { headers: { 'Content-Type': 'application/json' } }
        )
        const cache = await caches.open(env.URL_CACHE)
        const urlDbWrite = env.URL_DB.put(urlKey, originalUrl, {
            expirationTtl: env.URL_EXPIRATION_TTL,
        })
        const cacheWrite = cache.put(originalUrl, response.clone())

        if (ctx && typeof ctx.waitUntil === 'function') {
            ctx.waitUntil(urlDbWrite)
            ctx.waitUntil(cacheWrite)
        } else {
            await urlDbWrite
            await cacheWrite
        }

        return response
    } catch (error) {
        console.error(error, error.stack)
        return new Response('Internal Server Error', { status: 500 })
    }
}
