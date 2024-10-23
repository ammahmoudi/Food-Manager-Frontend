"use client";
import { Toaster } from "sonner";
import React from "react";

interface ToastProviderProps {
	children: React.ReactNode;
}
export default function ToastProvider({ children }: ToastProviderProps) {
	// const contextClass = {
	// 	toast: "bg-blue-400",
	// 	title: "text-red-400",
	// 	description: "text-red-400",
	// 	actionButton: "bg-zinc-400",
	// 	cancelButton: "bg-orange-400",
	// 	closeButton: "bg-lime-400",
	// };


	return (
		<>
			<Toaster richColors
			position="top-right"
			closeButton
				toastOptions={{
					unstyled: false,
				}}
			/>
			{children}
		</>
	);
}
