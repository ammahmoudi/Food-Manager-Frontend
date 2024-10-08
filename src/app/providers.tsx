"use client";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import ToastProvider from "./ToastProvider";
import { UserProvider } from "@/context/UserContext";


type Props = {
	children: React.ReactNode;
};

export default function Providers({ children }: Props) {
	const router = useRouter();
	return (
		<UserProvider>
		<ToastProvider>
			<NextUIProvider navigate={router.push}>
				{children}
			</NextUIProvider>
		</ToastProvider>
		</UserProvider>
	);
}
