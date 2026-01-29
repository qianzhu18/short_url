const TURNSTILE_SITEVERIFY_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/*
Turnstile is Cloudflare's smart CAPTCHA alternative.

A middleware that calls Cloudflare's siteverify endpoint to validate the Turnstile widget response.

Do note to set `TURNSTILE_SECRET` and `TEST_URL` accordingly.
*/
export const turnstileMiddleware = async (request, env) => {
    const testUrl = typeof env.TEST_URL === 'string' ? env.TEST_URL : ''
    if (testUrl && request.url === testUrl) {
        console.log('Skipping Turnstile verification for tests.')
        return
    }

    const turnstileSecret = typeof env.TURNSTILE_SECRET === 'string' ? env.TURNSTILE_SECRET : ''
    if (!turnstileSecret) {
        console.warn('TURNSTILE_SECRET is not configured.')
        return new Response('Turnstile not configured', { status: 500 })
    }

    const { turnstileToken } = await request.clone().json()
    if (!turnstileToken) {
        return new Response('Missing Turnstile token', { status: 400 })
    }

    const response = await fetch(TURNSTILE_SITEVERIFY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `response=${turnstileToken}&secret=${turnstileSecret}`,
    })

    const verification = await response.json()
    if (!verification.success) {
        return new Response('Too Many Requests', { status: 429 })
    }
}
