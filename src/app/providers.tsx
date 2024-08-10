"use client";

import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Router } from "next/router";

type Props = {
	children: React.ReactNode;
};

export default function Providers({ children }: Props) {
	const router = useRouter();
	return <NextUIProvider navigate={router.push}>{children}</NextUIProvider>;
}
