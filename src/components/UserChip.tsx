import React from "react";
import { Popover, PopoverTrigger, PopoverContent, Chip, Avatar } from "@nextui-org/react";
import { UserTwitterCard } from "./UserTwitterCard";

interface UserChipProps {
  userName: string;
  userAvatar: string;
  userHandle: string;
  bio: string;
  following: number;
  followers: number;
}

const UserChip: React.FC<UserChipProps> = ({
  userName,
  userAvatar,
  userHandle,
  bio,
  following,
  followers,
}) => {
  return (
    <Popover showArrow placement="bottom">
      <PopoverTrigger>
        <Chip
          variant="flat"
          avatar={<Avatar name={userName} src={userAvatar} />}
          as="button"
          className="self-center "
          size="md"
        >
          {userName}
        </Chip>
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <UserTwitterCard
          userName={userName}
          userHandle={userHandle}
          userAvatar={userAvatar}
          bio={bio}
          following={following}
          followers={followers}
        />
      </PopoverContent>
    </Popover>
  );
};

export default UserChip;
