"use client";
import type { Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";
import GlobalNavbar from "@/components/GlobalNavbar";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const viewport: Viewport = {
	themeColor: "#FFFFFF",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
  	// useEffect(() => {
	// 	const getFCMToken = async () => {
	// 		const token = await requestPermission();
	// 		if (token) {
	// 			// Send the FCM token to your backend to subscribe the user
	// 			await api.post("/users/subscribe/", {
	// 				method: "POST",
	// 				headers: {
	// 					"Content-Type": "application/json",
	// 				},
	// 				token:token,
	// 			});
	// 		}
	// 	};

	// 	getFCMToken();

	// 	// Listen for messages when app is open
	// 	onMessageListener().then((payload: any) => {
	// 		console.log("Push notification received: ", payload);
	// 		toast.info(payload.notification?.title || "New message");
	// 	});
	// }, []);
	return (
		<html lang="en" className="light">
			<head>
				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" content="#3730a3" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<GlobalNavbar />
					{children}
				</Providers>
			</body>
		</html>
	);
}
