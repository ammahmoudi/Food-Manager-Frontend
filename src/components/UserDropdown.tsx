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
import { User } from "@/interfaces/User";

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
					name={user.full_name}
					size="sm"
					src={user.user_image as string}
				/>
			</DropdownTrigger>
			<DropdownMenu aria-label="Profile Actions" variant="flat">
				<DropdownItem textValue={user.full_name} key="profile" className="h-14 gap-2">
					<p className="font-semibold">Signed in as</p>
					<p className="font-semibold">{user.full_name}</p>
				</DropdownItem>
				<DropdownItem textValue="log out" key="settings" href="/settings">
					My Settings
				</DropdownItem>
				<DropdownItem key="logout" color="danger" href="/logout">
					Log Out
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
};

export default UserDropdown;
