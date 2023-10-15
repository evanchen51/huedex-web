module.exports = {
	experimental: {
		scrollRestoration: true,
	},
	images: { domains: [process.env.NEXT_PUBLIC_WEB_DOMAIN, process.env.NEXT_PUBLIC_S3_DOMAIN] },
	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_WEB_DOMAIN: process.env.NEXT_PUBLIC_WEB_DOMAIN,
		NEXT_PUBLIC_S3_DOMAIN: process.env.NEXT_PUBLIC_S3_DOMAIN,
	},
}
