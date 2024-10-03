"use client";

import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";
import GlobalNavbar from "@/components/GlobalNavbar";
import Head from "next/head";
// import useFcmToken from "@/hooks/useFcmToken";

const APP_NAME = "Berchi";
const APP_DESCRIPTION = "This is an example of using next-pwa plugin";

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
//   const { notificationPermissionStatus } = useFcmToken();
//   console.log('notification status:',notificationPermissionStatus);
//   // // Function to handle Accept button click
//   const handleAccept = () => {
//   	toast.dismiss(); // Dismiss the toast
//   	console.log("Accepted push notifications.");
//   	// Your logic to enable push notifications
//   };

//   // Function to handle Decline button click
//   const handleDecline = () => {
//   	toast.dismiss(); // Dismiss the toast
//   	console.log("Declined push notifications.");
//   	// Your logic to handle push notification decline
//   };

// //   Show the toast notification when permission status is 'default' (i.e., ask for permission)
//   useEffect(() => {
//   	if (notificationPermissionStatus!='granted') {
//   		toast.info(
//   			<div>
//   				<p>Would you like to enable push notifications?</p>
//   				<div>
//   					<button
//   						style={{ marginRight: 10 }}
//   						onClick={handleAccept}
//   					>
//   						Accept
//   					</button>
//   					<button onClick={handleDecline}>Decline</button>
//   				</div>
//   			</div>,
//   			{
//   				position: 'bottom-center',
//   				autoClose: false, // Keeps the toast open until user interacts
//   				closeOnClick: false, // Prevents closing by clicking anywhere else
//   			}
//   		);
//   	}
//   }, [notificationPermissionStatus]);

  return (
    <html lang="en" className="light">
      <Head>
        <meta name="application-name" content={APP_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        <meta name="description" content={APP_DESCRIPTION} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* <meta name="theme-color" content="#FFFFFF" /> */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <style>{`
            html, body, #__next {
              height: 100%;
            }
            #__next {
              margin: 0 auto;
            }
            h1 {
              text-align: center;
            }
            `}</style>
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <GlobalNavbar />

          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
