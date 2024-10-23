"use client";
import {
	Dropdown,
	DropdownTrigger,
	Avatar,
	DropdownMenu,
	DropdownItem,
	DropdownSection,
} from "@nextui-org/react";
import { useUser } from "@/context/UserContext";

const UserDropdown = () => {
	const { user, isAdmin } = useUser();

	if (!user) {
		return <div>Loading...</div>;
	}

	// Build the menu dynamically
	const menuItems = [
		<DropdownItem
			textValue={user.full_name}
			key="profile"
			className="h-14 gap-2"
		>
			<p className="font-semibold">Signed in as</p>
			<p className="font-semibold">{user.full_name}</p>
		</DropdownItem>,

		<DropdownSection key="apps" title="Apps">
			<DropdownItem textValue="Maani" key="Maani" href="/humaani/">
				Maani
			</DropdownItem>
			<DropdownItem textValue="Berchi" key="Berchi" href="/berchi/">
				Berchi
			</DropdownItem>
		</DropdownSection>,

		<DropdownItem textValue="My Settings" key="settings" href="/settings">
			My Settings
		</DropdownItem>,
	];

	// Conditionally add admin section
	if (isAdmin) {
		menuItems.push(
			<DropdownSection key="admin" title="Admin">
				<DropdownItem
					textValue="Push Notifications"
					key="pushNotifications"
					href="/admin/notifications"
				>
					Notifications
				</DropdownItem>
			</DropdownSection>
		);
	}

	// Add logout item
	menuItems.push(
		<DropdownItem key="logout" color="danger" href="/logout">
			Log Out
		</DropdownItem>
	);

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
				{menuItems}
			</DropdownMenu>
		</Dropdown>
	);
};

export default UserDropdown;
