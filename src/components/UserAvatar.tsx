'use client';

import React from "react";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	Avatar,
} from "@nextui-org/react";
import { UserTwitterCard } from "./UserTwitterCard";
import { User } from "@/interfaces/User";

interface UserChipProps {
	user: User;
}

const UserAvatar: React.FC<UserChipProps> = ({ user }) => {
	return (
		<Popover showArrow placement="bottom">
			<PopoverTrigger>
				<Avatar src={user.user_image as string} name={user.full_name} />
			</PopoverTrigger>
			<PopoverContent className="p-1">
				<UserTwitterCard user={user} />
			</PopoverContent>
		</Popover>
	);
};

export default UserAvatar;
