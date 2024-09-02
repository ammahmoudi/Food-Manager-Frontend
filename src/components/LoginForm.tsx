// components/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Checkbox } from "@nextui-org/react";
import { PhoneIcon, KeyIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { login } from "@/services/api";

export default function LoginForm() {
	const router = useRouter();
	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [phoneError, setPhoneError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const toggleVisibility = () => setIsVisible(!isVisible);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const { access, refresh } = await login(phoneNumber, password);
			if (rememberMe) {
				localStorage.setItem("access", access);
				localStorage.setItem("refresh", refresh);
			} else {
				sessionStorage.setItem("access", access);
				sessionStorage.setItem("refresh", refresh);
			}
			router.push("/");
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	return (
		<form className="flex flex-col gap-4" onSubmit={handleLogin}>
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
