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
