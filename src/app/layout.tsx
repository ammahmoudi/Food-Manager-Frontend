// pages/index.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import GlobalNavbar from "../components/GlobalNavbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>

        <Providers >

<GlobalNavbar/> 
           {children}
          </Providers>
       

      </body>
    </html>
  );
}
