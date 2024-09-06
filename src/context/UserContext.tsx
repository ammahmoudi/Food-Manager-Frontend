import React, { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser, login, refreshToken, signup, updateUser } from "@/services/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UserContextType {
	user: any;
	setUser: React.Dispatch<React.SetStateAction<any>>;
	isLoading: boolean;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
	isAuthenticated: boolean;
	isAdmin: boolean;
	handleLogin: (
		phoneNumber: string,
		password: string,
		remember: boolean
	) => Promise<void>;
	handleLogout: () => void;
	handleSignup: (userData: any) => Promise<void>;
	updateUserData: (userData: any) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			setIsLoading(true);
			const accessToken = localStorage.getItem("access") || sessionStorage.getItem("access");

			if (!accessToken) {
				setUser(null);
				setIsLoading(false);
				return;
			}

			try {
				const userData = await toast.promise(getCurrentUser(), {
					// pending: "Fetching user data...",
					// success: "User authenticated!",
					error: "Failed to authenticate user",
				});
				setUser(userData);
			} catch (error) {
				console.error("Failed to get current user:", error);
				const newAccessToken = await refreshToken();

				if (newAccessToken) {
					try {
						const userData = await getCurrentUser();
						setUser(userData);
					} catch (error) {
						console.error("Failed to get user after refreshing token:", error);
						handleLogout();
					}
				} else {
					handleLogout();
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchUser();
	}, []);

	const handleLogin = async (
		phoneNumber: string,
		password: string,
		remember: boolean
	) => {
		try {
			await toast.promise(
				login(phoneNumber, password),
				{
					pending: "Logging in...",
					success: "Login successful! 🎉",
					error: "Login failed. Please check your credentials.",
				}
			).then(async ({ access, refresh }) => {
				if (remember) {
					localStorage.setItem("access", access);
					localStorage.setItem("refresh", refresh);
				} else {
					sessionStorage.setItem("access", access);
					sessionStorage.setItem("refresh", refresh);
				}
				const userData = await getCurrentUser();
				setUser(userData);
				router.push("/");
			});
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	const handleLogout = () => {
		toast.info("Logging out...");
		localStorage.removeItem("access");
		localStorage.removeItem("refresh");
		sessionStorage.removeItem("access");
		sessionStorage.removeItem("refresh");
		setUser(null);
		router.push("/login");
	};

	const handleSignup = async (userData: any) => {
		try {
			await toast.promise(
				signup(userData),
				{
					pending: "Signing up...",
					success: "Signup successful! 🎉",
					error: "Signup failed. Please try again.",
				}
			).then(async () => {
				await handleLogin(userData.phone_number, userData.password, true);
			});
		} catch (error) {
			console.error("Signup failed:", error);
		}
	};

	const updateUserData = async (userData: any) => {
		try {
			const updatedUser = await toast.promise(
				updateUser(userData),
				{
					pending: "Updating user data...",
					success: "User data updated! 🎉",
					error: "Failed to update user data.",
				}
			);
			setUser(updatedUser);
		} catch (error) {
			console.error("Failed to update user data:", error);
		}
	};

	const isAuthenticated = !!user;
	const isAdmin = user?.role === "admin";

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				isLoading,
				setIsLoading,
				isAuthenticated,
				isAdmin,
				handleLogin,
				handleLogout,
				handleSignup,
				updateUserData,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};
