"use client";

import React from "react";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	Chip,
	Avatar,
} from "@nextui-org/react";
import { UserTwitterCard } from "./UserTwitterCard";
import { User } from "@/interfaces/User";

interface UserChipProps {
	user: User | null;
	size:"sm" | "md" | "lg" | undefined

}

const UserChip: React.FC<UserChipProps> = ({ user,size }) => {
	return (
		user && (
			<Popover showArrow placement="bottom">
				<PopoverTrigger>
					<Chip
						variant="bordered"
						avatar={
							<Avatar name={user.full_name} src={user.user_image as string} />
						}
						as="button"
						className="self-center "
						size={size}
					>
						{user.full_name}
					</Chip>
				</PopoverTrigger>
				<PopoverContent className="p-1">
					<UserTwitterCard user={user} />
				</PopoverContent>
			</Popover>
		)
	);
};

export default UserChip;
