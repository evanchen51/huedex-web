/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				// foreground: "#FCFCFC",
				// background: "#333333",
				foreground: "#222222",
				background: "#F7F7F7",
				secondary: "#BBBBBB",
				accent: "#FF5E85",
				negative: "#ef4444",
			},
		},
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
		fontFamily: {
			// sans: ["Avenir Next", "sans-serif"],
			sans: ["Asap", "sans-serif"],
		},
	},
	plugins: [],
}
