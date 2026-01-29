/* eslint-disable no-undef */
const TURNSTILE_SITEVERIFY_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const isSecretConfigured = typeof TURNSTILE_SECRET === 'string' && TURNSTILE_SECRET.length > 0
const testUrl = typeof TEST_URL === 'string' ? TEST_URL : ''

/*
Turnstile is Cloudflare's smart CAPTCHA alternative.

A middleware that calls Cloudflare's siteverify endpoint to validate the Turnstile widget response.

Do note to set `TURNSTILE_SECRET` and `TEST_URL` accordingly.
*/
export const turnstileMiddleware = async (request) => {
    /* eslint-disable no-undef */
    if (testUrl && request.url === testUrl) {
        console.log('Skipping Turnstile verification for tests.')
        return
    }

    if (!isSecretConfigured) {
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
        body: `response=${turnstileToken}&secret=${TURNSTILE_SECRET}`,
    })

    const verification = await response.json()
    if (!verification.success) {
        return new Response('Too Many Requests', { status: 429 })
    }
}
