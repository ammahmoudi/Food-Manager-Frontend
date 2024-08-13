"use client";

import { useEffect, useState } from "react";
import {
	Dropdown,
	DropdownTrigger,
	Avatar,
	DropdownMenu,
	DropdownItem,
} from "@nextui-org/react";
import { getCurrentUser } from "../services/api"; // Import the API function

interface User {
    id: number;
    name: string;
    phone_number: string;
    user_image: string;
  }

const UserDropdown = () => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userData = await getCurrentUser(); // Use the getCurrentUser API function
				setUser(userData);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchUser();
	}, []);

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<Dropdown placement="bottom-end">
			<DropdownTrigger>
				<Avatar
					isBordered
					as="button"
					className="transition-transform"
					color="secondary"
					name={user.name}
					size="sm"
					src={user.user_image || "https://i.pravatar.cc/150?u=default"}
				/>
			</DropdownTrigger>
			<DropdownMenu aria-label="Profile Actions" variant="flat">
				<DropdownItem key="profile" className="h-14 gap-2">
					<p className="font-semibold">Signed in as</p>
					<p className="font-semibold">{user.name}</p>
				</DropdownItem>
				<DropdownItem key="settings" href="/settings">My Settings</DropdownItem>
				<DropdownItem key="logout"  color="danger" href="/logout">
					Log Out
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
};

export default UserDropdown;
