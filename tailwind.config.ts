// tailwind.config.ts
import { nextui } from "@nextui-org/theme";
import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				ai: {
					background: "#F0F8FF",
					primary: "#FF9C00",
					secondary: "#4B0082",
				},
				berchi: {
					background: "#F5FFFA",
					primary: "#3D929D",
					secondary: "#54B9C6",
				},
			},
		},
	},
	darkMode: "class",
	plugins: [
		nextui({
			themes: {
				light: {
					// Light theme configuration
				},
				dark: {
					// Dark theme configuration
				},
				ai: {
					colors: {
						background: "#F0F8FF",
						primary: "#FF9C00",
					secondary: "#4B0082",
					},
				},
				berchi: {
					colors: {
						background: "#F5FFFA",
						primary: "#3D929D",
					secondary: "#54B9C6",
					},
				},
			},
		}),
	],
};

export default config;
