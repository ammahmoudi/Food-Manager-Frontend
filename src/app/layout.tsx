'use client'
// pages/index.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import GlobalNavbar from "../components/GlobalNavbar";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	useEffect(() => {
		if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
		  navigator.serviceWorker.register('/sw.js').then(
			(registration) => {
			  console.log('Service Worker registered with scope:', registration.scope);
			},
			(error) => {
			  console.error('Service Worker registration failed:', error);
			}
		  );
		}
	  }, []);
	return (
		<html lang="en" className="light">
			 <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3730a3" />
      </head>
			<body className={inter.className}>
				<Providers>
					<GlobalNavbar />
					{children}
				</Providers>
			</body>
		</html>
	);
}
