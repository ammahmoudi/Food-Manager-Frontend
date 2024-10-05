"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Checkbox } from "@nextui-org/react";
import { PhoneIcon, KeyIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";

export default function LoginForm() {
	const router = useRouter();
	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [phoneError, setPhoneError] = useState("");
	const [passwordError, setPasswordError] = useState("");
    const { isAuthenticated, handleLogin } = useUser();

	const toggleVisibility = () => setIsVisible(!isVisible);

	const handleLoginUser = async (e: React.FormEvent) => {
		e.preventDefault();

		// Perform validation here if necessary, e.g., validate phone number format
		if (!phoneNumber || !password) {
			setPhoneError(!phoneNumber ? "Phone number is required" : "");
			setPasswordError(!password ? "Password is required" : "");
			return;
		}

		try {
			const loginPromise = handleLogin(phoneNumber, password, rememberMe);

			await toast.promise(
				loginPromise,
				{
					// pending: "Logging in...",
					// success: "Logged in successfully!",
					// error: "Failed to log in. Please check your credentials.",
				}
			);

			if (isAuthenticated) {
				router.push("/dashboard");
			}
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	return (
		<form className="flex flex-col gap-4" onSubmit={handleLoginUser}>
			<Input
				isRequired
				label="Phone Number"
				placeholder="Enter your phone number"
				type="tel"
				startContent={<PhoneIcon className="text-default-500 size-6" />}
				value={phoneNumber}
				onChange={(e) => setPhoneNumber(e.target.value)}
				isInvalid={!!phoneError}
				errorMessage={phoneError}
			/>
			<Input
				isRequired
				label="Password"
				placeholder="Enter your password"
				type={isVisible ? "text" : "password"}
				startContent={<KeyIcon className="text-default-500 size-6" />}
				endContent={
					<button className="focus:outline-none" type="button" onClick={toggleVisibility}>
						{isVisible ? (
							<EyeSlashIcon className="text-2xl text-default-400 pointer-events-none" />
						) : (
							<EyeIcon className="text-2xl text-default-400 pointer-events-none" />
						)}
					</button>
				}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				isInvalid={!!passwordError}
				errorMessage={passwordError}
			/>
			<Checkbox
				isSelected={rememberMe}
				onChange={(e) => setRememberMe(e.target.checked)}
			>
				Remember me
			</Checkbox>
			<Button type="submit" fullWidth color="primary">
				Login
			</Button>
		</form>
	);
}
