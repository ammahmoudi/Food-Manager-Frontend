"use client";
import { ChangeEvent, useEffect, useState } from "react";
import {
	Input,
	Button,
	Card,
	CardFooter,
	Image,
	useDisclosure,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalContent,
	CardBody,
} from "@nextui-org/react";
import {
	changePassword,
	checkPhoneNumberUnique,
} from "@/services/api";
import {
	UserCircleIcon,
	DevicePhoneMobileIcon,
	KeyIcon,
	ShieldCheckIcon,
	TrashIcon,
} from "@heroicons/react/24/solid";
import debounce from "@/utils/debounce";
import { useUser } from "@/context/UserContext";
import ImageCropModal from "@/components/ImageCropModal";
import { UpdateUserData } from "@/interfaces/UpdateUserData";
import { toast } from "sonner";
import React from "react";

const SettingsPage = () => {
	const { user, updateUserData, isLoading } = useUser(); // Destructure methods from useUser
	const [name, setName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [userImage, setUserImage] = useState<File | string | null>(null);
	const [nameError, setNameError] = useState("");
	const [phoneError, setPhoneError] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const {
		isOpen: isPasswordModalOpen,
		onOpen: openPasswordModal,
		onClose: closePasswordModal,
	} = useDisclosure();
	const {
		isOpen: isCropModalOpen,
		onOpen: openCropModal,
		onClose: closeCropModal,
	} = useDisclosure();

	// useEffect to set initial state from user context
	useEffect(() => {
		if (user) {
			setName(user.full_name || "");
			setPhoneNumber(user.phone_number || "");
			setUserImage(user.user_image || null);
		}
	}, [user]);

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setUserImage(imageUrl);
			openCropModal(); // Open the crop modal after selecting the image
		}
	};
	const handleCropComplete = (croppedImage: File) => {
		setUserImage(croppedImage); // Set the cropped image as the selected image
		closeCropModal();
	};

	const handleDeleteImage = () => {
		setUserImage(null);
	};

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
			console.error("Error validating phone number",error)
			return ("Error validating phone number");
		}

		return "";
	};

	const debounceValidatePhoneNumber = debounce(async (value: string) => {
		if (value !== user?.phone_number) {
			setPhoneError(await validatePhoneNumber(value));
		}
	});

	const handleSave = async () => {
		// Create a new object to store the updated user data
		const userData: UpdateUserData = {
			full_name: name,
			phone_number: phoneNumber,
			remove_image: userImage === null ? true : false,
		};

		// Only add the image if it's a File
		if (userImage instanceof File) {
			userData.user_image = userImage;
		}

		const saveUserPromise = updateUserData(userData);

		try {
			await toast.promise(saveUserPromise, {
				loading: "Saving changes...",
				success: "User data updated successfully!",
				error: "Failed to update user data",
			});
		} catch (error) {
			console.error("Failed to save user data:", error);
		}
	};

	const handlePasswordChange = async () => {
		if (newPassword !== confirmPassword) {
			setPasswordError("Passwords do not match");
			return;
		}

		const changePasswordPromise = changePassword(
			currentPassword,
			newPassword,
			confirmPassword
		);

		try {
			await toast.promise(changePasswordPromise, {
				loading: "Changing password...",
				success: "Password changed successfully!",
				error: "Failed to change password",
			});
			closePasswordModal();
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (error) {
			console.error("Failed to change password:", error);
		}
	};

	return (
		!isLoading && (
			<div className="container mx-auto p-4 max-w-lg ">
				<Card className="gap-3">
					<CardBody className="flex flex-col gap-3 md:flex md:flex-row ">
						<Card
							isPressable
							onClick={() =>
								document.getElementById("user-image-input")?.click()
							}
							className="h-full w-full aspect-square "
						>
							{userImage ? (
								<>
									<Image
										alt="User Image"
										className="z-0 w-full h-full object-cover"
										classNames={{ wrapper: "w-full h-full aspect-square " }}
										src={
											userImage instanceof File
												? URL.createObjectURL(userImage as File)
												: userImage
										}
									/>
									<CardFooter className="absolute bottom-0 z-10">
										<div className="flex items-center">
											<div className="flex flex-col">
												<Button
													onClick={(e) => {
														e.stopPropagation();
														handleDeleteImage();
													}}
													radius="full"
													size="sm"
													className="w-full h-full aspect-square bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
												>
													<TrashIcon className="h-5 w-5" />
												</Button>
											</div>
										</div>
									</CardFooter>
								</>
							) : (
								<div className="flex flex-col items-center justify-center w-full h-full bg-gray-200">
									<p className="text-gray-500">Click to upload an image</p>
								</div>
							)}
						</Card>
						<input
							type="file"
							id="user-image-input"
							accept="image/*"
							className="hidden"
							onChange={handleImageChange}
							title="user image"

						/>
						<div className="flex flex-grow flex-col justify-between gap-3 w-full">
							<Input
								label="Name"
								placeholder="Enter your name"
								startContent={
									<UserCircleIcon className="h-5 w-5 text-gray-500" />
								}
								fullWidth
								value={name}
								isInvalid={!!nameError}
								errorMessage={nameError}
								onChange={(e) => {
									const value = e.target.value;
									setName(value);
									setNameError(validateName(value));
								}}
							/>
							<Input
								label="Phone Number"
								placeholder="Enter your phone number"
								startContent={
									<DevicePhoneMobileIcon className="h-5 w-5 text-gray-500" />
								}
								fullWidth
								value={phoneNumber}
								isInvalid={!!phoneError}
								errorMessage={phoneError}
								onChange={(e) => {
									const value = e.target.value;
									setPhoneNumber(value);
									debounceValidatePhoneNumber(value);
								}}
							/>
							<Input
								label="Role"
								placeholder="Your role"
								startContent={
									<ShieldCheckIcon className="h-5 w-5 text-gray-500" />
								}
								fullWidth
								value={user?.role}
								readOnly
								disabled
							/>
						</div>
					</CardBody>
					<CardFooter>
						<div className="flex justify-between gap-2">
							<Button
								isDisabled={
									(user &&
									name === user.full_name &&
									phoneNumber === user.phone_number &&
									userImage === user.user_image)||undefined
								}
								color="primary"
								onPress={handleSave}
							>
								Save Changes
							</Button>
							<Button color="secondary" onPress={openPasswordModal}>
								Change Password
							</Button>
						</div>
					</CardFooter>
				</Card>

				{/* Password Change Modal */}
				<Modal isOpen={isPasswordModalOpen} onClose={closePasswordModal}>
					<ModalContent>
						<ModalHeader>Change Password</ModalHeader>
						<ModalBody>
							<Input
								label="Current Password"
								placeholder="Enter current password"
								startContent={<KeyIcon className="h-5 w-5 text-gray-500" />}
								fullWidth
								type="password"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
							/>
							<Input
								label="New Password"
								placeholder="Enter new password"
								startContent={<KeyIcon className="h-5 w-5 text-gray-500" />}
								fullWidth
								type="password"
								value={newPassword}
								isInvalid={!!passwordError}
								errorMessage={passwordError}
								onChange={(e) => setNewPassword(e.target.value)}
							/>
							<Input
								label="Confirm Password"
								placeholder="Confirm new password"
								startContent={<KeyIcon className="h-5 w-5 text-gray-500" />}
								fullWidth
								type="password"
								value={confirmPassword}
								isInvalid={!!passwordError}
								errorMessage={passwordError}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</ModalBody>
						<ModalFooter>
							<Button color="primary" onPress={handlePasswordChange}>
								Save Password
							</Button>
							<Button variant="light" onPress={closePasswordModal}>
								Cancel
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
				<ImageCropModal
					isOpen={isCropModalOpen}
					onClose={closeCropModal}
					imageSrc={userImage as string} // Send the image URL to the crop modal
					onCropComplete={handleCropComplete}
				/>
			</div>
		)
	);
};

export default SettingsPage;
