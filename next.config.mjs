/** @type {import('next').NextConfig} */
import withSerwistInit from "@serwist/next";
// const revision = crypto.randomUUID();

const nextConfig = {
	reactStrictMode: false, // Enable React strict mode for improved error handling
	swcMinify: true, // Enable SWC minification for improved performance
	compiler: {
		// removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
	},
};


const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  disable:true,
  // additionalPrecacheEntries: [{ url: "/fallback", revision }],

  


});

export default withSerwist(nextConfig);