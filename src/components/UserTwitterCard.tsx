import React from "react";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { User } from "@/interfaces/User";

interface UserTwitterCardProps {
user:User
}

export const UserTwitterCard: React.FC<UserTwitterCardProps> = ({
user
}) => {
  const [isFollowed, setIsFollowed] = React.useState(false);

  return (
    <Card shadow="none" className="max-w-[300px] border-none bg-transparent">
      <CardHeader className="justify-between">
        <div className="flex gap-3">
          <Avatar isBordered radius="full" size="md" src={user.user_image as string} />
          <div className="flex flex-col items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">{user.full_name}</h4>
            <h5 className="text-small tracking-tight text-default-500">{user.phone_number}</h5>
          </div>
        </div>
        {/* <Button
          className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
          color="primary"
          radius="full"
          size="sm"
          variant={isFollowed ? "bordered" : "solid"}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </Button> */}
      </CardHeader>
      {/* <CardBody className="px-3 py-0">
        <p className="text-small pl-px text-default-500">{bio}</p>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">{following}</p>
          <p className=" text-default-500 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">{followers}</p>
          <p className="text-default-500 text-small">Followers</p>
        </div>
      </CardFooter> */}
    </Card>
  );
};
