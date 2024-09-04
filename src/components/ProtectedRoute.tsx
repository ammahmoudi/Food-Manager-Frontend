// components/ProtectedRoute.tsx
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";

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
		return <div>Loading...</div>;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
