/** @type {import('next').NextConfig} */
import withPWAInit from "next-pwa";
const nextConfig = {
	reactStrictMode: false, // Enable React strict mode for improved error handling
	swcMinify: true, // Enable SWC minification for improved performance
	compiler: {
		// removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
	},
};

//   Configuration object tells the next-pwa plugin
const withPWA = withPWAInit({
	dest: "public", // Destination directory for the PWA files
	disable: false,
	//  process.env.NODE_ENV === "development", // Disable PWA in development mode
	register: true, // Register the PWA service worker
	reloadOnOnline: true, // Enable refresh when the app is online again
    swSrc: 'service-worker.js',

	skipWaiting: true, // Skip waiting for service worker activation
});

//   Export the combined configuration for Next.js with PWA support
export default withPWA(nextConfig);
//   export default nextConfig;
