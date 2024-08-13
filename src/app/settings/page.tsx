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
import { updateUser, getCurrentUser, changePassword } from "@/services/api";
import {
  UserCircleIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
  PhotoIcon,
  ShieldCheckIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

const SettingsPage = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userImage, setUserImage] = useState<File | null>(null);
  const [userImageUrl, setUserImageUrl] = useState("");
  const [role, setRole] = useState("");
  const [initialData, setInitialData] = useState<any>({});
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const {
    isOpen: isPasswordModalOpen,
    onOpen: openPasswordModal,
    onClose: closePasswordModal,
  } = useDisclosure();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser();
        setName(user.name);
        setPhoneNumber(user.phone_number);
        setUserImageUrl(user.user_image || "");
        setRole(user.role);
        setInitialData({
          name: user.name,
          phoneNumber: user.phone_number,
          userImageUrl: user.user_image,
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserImage(file);
      setUserImageUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
    setUserImage(null);
    setUserImageUrl("");
  };

  const validateName = (value: string) => {
    return value.length > 0;
  };

  const validatePhoneNumber = (value: string) => {
    return /^\+?\d{10,15}$/.test(value);
  };

  const handleSave = async () => {
    try {
      const updatedUser = await updateUser({
        name,
        phone_number: phoneNumber,
        user_image: userImage,
      });
      setInitialData({ name, phoneNumber, userImageUrl });
      // Reset state after save
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }

      await changePassword(currentPassword, newPassword, confirmPassword);
      closePasswordModal();
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to change password:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md ">
      <Card className="gap-3">
        <CardBody className="gap-3 ">
          <Card
            isPressable
            onClick={() => document.getElementById("user-image-input")?.click()}
            className="h-full w-full aspect-square "
          >
            {userImageUrl ? (
              <>
                <Image
                  alt="User Image"
                  className="z-0 w-full h-full object-cover"
                  classNames={{ wrapper: "w-full h-full aspect-square " }}
                  src={userImageUrl}
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
          <Input
            type="file"
            id="user-image-input"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          <Input
            label="Name"
            placeholder="Enter your name"
            startContent={<UserCircleIcon className="h-5 w-5 text-gray-500" />}
            fullWidth
            value={name}
            isInvalid={!!nameError}
            errorMessage={nameError}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(
                validateName(e.target.value) ? "" : "Name cannot be empty"
              );
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
              setPhoneNumber(e.target.value);
              setPhoneError(
                validatePhoneNumber(e.target.value)
                  ? ""
                  : "Please enter a valid phone number"
              );
            }}
          />
          <Input
            label="Role"
            placeholder="Your role"
            startContent={<ShieldCheckIcon className="h-5 w-5 text-gray-500" />}
            fullWidth
            value={role}
            readOnly
            disabled
          />
        </CardBody>
        <CardFooter>
          <div className="flex justify-between gap-2">
            <Button
              disabled={
                name === initialData.name &&
                phoneNumber === initialData.phoneNumber &&
                userImageUrl === initialData.userImageUrl
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
    </div>
  );
};

export default SettingsPage;
