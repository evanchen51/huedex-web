/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/pages/**/*.{js,ts,jsx,tsx}",
		"./src/components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
		// screens: {
		// 	xl: { max: "1279px" },
		// 	// => @media (max-width: 1279px) { ... }

		// 	lg: { max: "1023px" },
		// 	// => @media (max-width: 1023px) { ... }

		// 	md: { max: "767px" },
		// 	// => @media (max-width: 767px) { ... }

		// 	sm: { max: "639px" },
		// 	// => @media (max-width: 639px) { ... }
		// },
		colors: {
			// foreground: "#FCFCFC",
			// background: "#333333",
			foreground: "#222222",
			background: "#FCFCFC",
			secondary: "#BBBBBB",
			accent: "#FF5E85",
		},
		fontFamily: {
			// sans: ["Avenir Next", "sans-serif"],
			sans: ["Helvetica", "sans-serif"],
		},
	},
	plugins: [],
}
