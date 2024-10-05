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
					background: "#F0F8FF", // AI specific background color
					primary: "#FF9C00", // AI primary color
					secondary: "#4B0082", // AI secondary color
				},
				berchi: {
					background: "#C8C3BD", // Berchi specific background color
					primary: "#3D929D", // Berchi primary color
					secondary: "#54B9C6", // Berchi secondary color
				},
			},
		},
	},
	darkMode: "class",
	plugins: [
		nextui({
			themes: {
				light: {
					// Existing light theme configuration
				},
				dark: {
					// Existing dark theme configuration
				},
				ai: {
					colors: {
						background: "#F0F8FF", // AI specific background color
						primary: "#FF9C00", // AI primary color
						secondary: "#4B0082", // AI secondary color
					},
				},
				berchi: {
					colors: {
						background: "#C8C3BD", // Berchi specific background color
						primary: "#3D929D", // Berchi primary color
						secondary: "#54B9C6", // Berchi secondary color
					},
				},
			},
		}),
	],
};

export default config;
