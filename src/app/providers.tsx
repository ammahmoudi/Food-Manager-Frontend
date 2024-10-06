"use client";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import ToastProvider from "./ToastProvider";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeContext";


type Props = {
	children: React.ReactNode;
};

export default function Providers({ children }: Props) {
	const router = useRouter();
	return (
				<UserProvider>
		<ThemeProvider>
		<NextUIProvider navigate={router.push}>
		<ToastProvider>
				{children}
		</ToastProvider>
			</NextUIProvider>
			</ThemeProvider>
		</UserProvider>

	);
}
