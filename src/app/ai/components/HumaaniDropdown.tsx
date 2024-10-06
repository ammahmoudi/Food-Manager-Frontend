"use client";
import {
	Dropdown,
	DropdownTrigger,
	Button,
	DropdownMenu,
	DropdownItem,
	Link,
} from "@nextui-org/react";
import { UserGroupIcon as UserGroupIconOutlone } from "@heroicons/react/24/outline";

const HumaaniDropdown = () => {
	

	return (
		<Dropdown placement="bottom-end" shouldCloseOnBlur>
			<DropdownTrigger>
				<Button
					as={Link}
					variant="light"
					startContent={<UserGroupIconOutlone className="text-grey size-6" />} // Button properties
				>
					<span className="hidden sm:inline">Humaani</span>
				</Button>
			</DropdownTrigger>
			<DropdownMenu aria-label="Profile Actions" variant="flat">
			<DropdownItem
					textValue="Characters"
					key="Characters"
					href="/ai/characters/"
				>
					Characters
				</DropdownItem>
				<DropdownItem
					textValue="New Character"
					key="NewCharacter"
					href="/ai/generatePicture/new/"
				>
					New Character
				</DropdownItem>

				<DropdownItem
					textValue="Generate Image from Character"
					key="generatePictureFromCharacter"
					href="/ai/generatePicture/fromCharacter/"
				>
					Generate Image from Character
				</DropdownItem>

			</DropdownMenu>
		</Dropdown>
	);
};

export default HumaaniDropdown;
