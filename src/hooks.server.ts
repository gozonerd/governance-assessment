import type { Handle } from '@sveltejs/kit';

/**
 * Security headers for all server responses.
 *
 * Note: script-src includes 'unsafe-inline' because SvelteKit injects inline
 * hydration scripts. For a stricter CSP, configure nonces in svelte.config.js.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Content Security Policy
	response.headers.set(
		'Content-Security-Policy',
		[
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline'",
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data:",
			"font-src 'self' data:",
			"object-src 'none'",
			"base-uri 'self'",
			"frame-ancestors 'none'",
			"form-action 'self'"
		].join('; ')
	);

	// Strict Transport Security (2 years, include subdomains, preload-eligible)
	response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

	// Prevent clickjacking
	response.headers.set('X-Frame-Options', 'DENY');

	// Prevent MIME-type sniffing
	response.headers.set('X-Content-Type-Options', 'nosniff');

	// Referrer policy
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	// Permissions policy — disable sensor/hardware APIs not needed by this app
	response.headers.set(
		'Permissions-Policy',
		'camera=(), microphone=(), geolocation=(), payment=()'
	);

	return response;
};
