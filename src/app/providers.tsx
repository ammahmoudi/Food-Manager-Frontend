"use client";

import { UserProvider } from "@/context/UserContext";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import ToastProvider from "./ToastProvider";

type Props = {
	children: React.ReactNode;
};

export default function Providers({ children }: Props) {
	const router = useRouter();
	return (
		<ToastProvider>
		<UserProvider>
			<NextUIProvider navigate={router.push}>
				{children}
			</NextUIProvider>
		</UserProvider>
		</ToastProvider>
	);
}
