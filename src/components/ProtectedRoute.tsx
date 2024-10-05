// components/ProtectedRoute.tsx
'use client';

import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";
import { Spinner } from "@nextui-org/react";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { isAuthenticated, isLoading } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [isAuthenticated, isLoading, router]);

	if (isLoading || !isAuthenticated) {
		return (
			<div className="container mx-auto p-4 w-screen h-screen flex justify-center items-center">
				{" "}
				<Spinner size="lg" color="primary" />
			</div>
		);
	}

	return <>{children}</>;
};

export default ProtectedRoute;
