"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@nextui-org/react";
import {
	UserCircleIcon,
	DevicePhoneMobileIcon,
	KeyIcon,
} from "@heroicons/react/24/solid";
import { checkPhoneNumberUnique } from "@/services/api";
import debounce from "@/utils/debounce";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

export default function SignupForm() {
	const router = useRouter();
	const [phoneNumber, setPhoneNumber] = useState("");
	const [phoneError, setPhoneError] = useState("");
	const [name, setName] = useState("");
	const [nameError, setNameError] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	const { handleSignup } = useUser();

	const validateName = (value: string) => {
		return value.trim() ? "" : "Name cannot be empty";
	};

	const validatePhoneNumber = async (value: string) => {
		if (!/^\+?\d{10,15}$/.test(value)) {
			return "Please enter a valid phone number";
		}
		try {
			const response = await checkPhoneNumberUnique(value);
			if (!response.is_unique) {
				return "Phone number already in use";
			}
		} catch (error) {
			return "Error validating phone number"+error;
		}

		return "";
	};

	const debounceValidatePhoneNumber = debounce(async (value: string) => {
		setPhoneError(await validatePhoneNumber(value));
	});

	const validatePassword = (value: string) => {
		const passwordCriteria =
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
		if (!passwordCriteria.test(value)) {
			return "Password must be at least 8 characters long and contain at least one number and one special character";
		}
		return "";
	};

	const debounceValidatePassword = debounce((value: string) => {
		const error = validatePassword(value);
		setPasswordError(error);
		if (confirmPassword && value !== confirmPassword) {
			setConfirmPasswordError("Passwords do not match");
		} else if (confirmPassword) {
			setConfirmPasswordError("");
		}
	}, 300);

	const debounceValidateConfirmPassword = debounce((value: string) => {
		if (value !== password) {
			setConfirmPasswordError("Passwords do not match");
		} else {
			setConfirmPasswordError("");
		}
	}, 300);

	const handleNameChange = (value: string) => {
		setName(value);
		setNameError(validateName(value));
	};

	const handlePhoneNumberChange = (value: string) => {
		setPhoneNumber(value);
		debounceValidatePhoneNumber(value);
	};

	const handlePasswordChange = (value: string) => {
		setPassword(value);
		debounceValidatePassword(value);
	};

	const handleConfirmPasswordChange = (value: string) => {
		setConfirmPassword(value);
		debounceValidateConfirmPassword(value);
	};

	const handleSignupUser = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!password || password !== confirmPassword) {
			setPasswordError("Passwords do not match or are invalid");
			return;
		}
		try {
			await toast.promise(
				handleSignup({
					phone_number: phoneNumber,
					full_name: name,
					password: password,
					re_password: confirmPassword,
				}),
				{
					// laoding: "Signing up...",
					// success: "Signup successful! 🎉",
					// error: "Signup failed. Please try again.",
				}
			);
			router.push("/login"); // Redirect to login after successful signup
		} catch (error) {
			console.error("Signup failed:", error);
		}
	};

	return (
		<form className="flex flex-col gap-4" onSubmit={handleSignupUser}>
			<Input
				isRequired
				label="Full Name"
				placeholder="Enter your full name"
				type="text"
				startContent={<UserCircleIcon className="h-5 w-5 text-gray-500" />}
				value={name}
				isInvalid={!!nameError}
				errorMessage={nameError}
				onChange={(e) => handleNameChange(e.target.value)}
			/>
			<Input
				isRequired
				label="Phone Number"
				placeholder="Enter your phone number"
				type="tel"
				startContent={
					<DevicePhoneMobileIcon className="h-5 w-5 text-gray-500" />
				}
				value={phoneNumber}
				isInvalid={!!phoneError}
				errorMessage={phoneError}
				onChange={(e) => handlePhoneNumberChange(e.target.value)}
			/>
			<Input
				isRequired
				label="Password"
				placeholder="Enter your password"
				// type={isVisible ? "text" : "password"}
				startContent={<KeyIcon className="h-5 w-5 text-gray-500" />}
				value={password}
				isInvalid={!!passwordError}
				errorMessage={passwordError}
				onChange={(e) => handlePasswordChange(e.target.value)}
			/>
			<Input
				isRequired
				label="Confirm Password"
				placeholder="Confirm your password"
				// type={isVisible ? "text" : "password"}
				startContent={<KeyIcon className="h-5 w-5 text-gray-500" />}
				value={confirmPassword}
				isInvalid={!!confirmPasswordError}
				errorMessage={confirmPasswordError}
				onChange={(e) => handleConfirmPasswordChange(e.target.value)}
			/>
			<Button
				type="submit"
				fullWidth
				color="primary"
				isDisabled={
					!!phoneError ||
					!!passwordError ||
					!!nameError ||
					!!confirmPasswordError
				}
			>
				Sign up
			</Button>
		</form>
	);
}
