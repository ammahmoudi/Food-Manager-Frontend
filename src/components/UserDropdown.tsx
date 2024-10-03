"use client";
import {
	Dropdown,
	DropdownTrigger,
	Avatar,
	DropdownMenu,
	DropdownItem,
} from "@nextui-org/react";
import { useUser } from "@/context/UserContext";

const UserDropdown = () => {
	const { user } = useUser();

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
					color="primary"
					name={user.full_name}
					size="sm"
					src={user.user_image as string}
				/>
			</DropdownTrigger>
			<DropdownMenu aria-label="Profile Actions" variant="flat">
				<DropdownItem
					textValue={user.full_name}
					key="profile"
					className="h-14 gap-2"
				>
					<p className="font-semibold">Signed in as</p>
					<p className="font-semibold">{user.full_name}</p>
				</DropdownItem>

				<DropdownItem
					textValue="Push Notifications"
					key="pushNotifications"
					href="/admin/notifications"
				>
					Notifications
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
