"use client";

import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";
import GlobalNavbar from "@/components/GlobalNavbar";
// import useFcmToken from "@/hooks/useFcmToken";

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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<html lang="en" className="light">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<GlobalNavbar />
        <div className=" min-h-screen pb-16 sm:pb-0 pt-5 sm:pt-0 bg-background"> {children}</div>

				</Providers>
			</body>
		</html>
	);
}
