'use client';

import React, { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser, login, refreshToken, signup, updateUser } from "@/services/api";
import { useRouter } from "next/navigation";
import { User } from "../interfaces/User";
import { SignUpData } from "../interfaces/SignUpData";
import { UpdateUserData } from "../interfaces/UpdateUserData";
import { toast } from "sonner";

interface UserContextType {
	user: User|null;
	setUser: React.Dispatch<React.SetStateAction<User|null>>;
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
	handleSignup: (userData: SignUpData) => Promise<void>;
	updateUserData: (userData:UpdateUserData) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User|null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const router = useRouter();


	const handleLogin = async (
		phoneNumber: string,
		password: string,
		remember: boolean
	) => {
		try {
			toast.promise(
				login(phoneNumber, password),
				{
					loading: "Logging in...",
					success: async ({ access, refresh }) => {
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
						return "Login successful! 🎉";
					},
					error: "Login failed. Please check your credentials.",
				}
			)
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

	const handleSignup = async (userData: SignUpData) => {
		try {
			toast.promise(
				signup(userData),
				{
					loading: "Signing up...",
					success: async () => {
						await handleLogin(userData.phone_number, userData.password, true);
						return "Signup successful! 🎉";
					}
					,
					error: "Signup failed. Please try again.",
				}
			)
		} catch (error) {
			console.error("Signup failed:", error);
		}
	};

	const updateUserData = async (userData: UpdateUserData) => {
		try {
			toast.promise(
				updateUser(userData),
				{
					loading: "Updating user data...",
					success: (updatedUser)=>{

						setUser(updatedUser);
						return "User data updated! 🎉";
					},
					error: "Failed to update user data.",
				}
			);
			
		} catch (error) {
			console.error("Failed to update user data:", error);
		}
	};

	const isAuthenticated = !!user;
	const isAdmin = user?.role === "admin";
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
				 toast.promise(getCurrentUser(), {
					// pending: "Fetching user data...",
					success: (userData) => {

						setUser(userData);
						return 'User data fetched successfully!';

					},
					error: "Failed to authenticate user",
				});
				
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
