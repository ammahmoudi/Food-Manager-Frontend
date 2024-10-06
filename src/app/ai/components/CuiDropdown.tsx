"use client";
import {
	Dropdown,
	DropdownTrigger,
	Button,
	DropdownMenu,
	DropdownItem,
	Link,
} from "@nextui-org/react";
import { PhotoIcon as PhotoIconOutline } from "@heroicons/react/24/outline";
import { useUser } from "@/context/UserContext";

const UserDropdown = () => {
	const { user } = useUser();

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<Dropdown placement="bottom-end" shouldCloseOnBlur>
			<DropdownTrigger>
				<Button
					as={Link}
					variant="light"
					startContent={<PhotoIconOutline className="text-grey size-6" />} // Button properties
				>
					<span className="hidden sm:inline">CumfyUI</span>
				</Button>
			</DropdownTrigger>
			<DropdownMenu aria-label="Profile Actions" variant="flat">
				<DropdownItem
					textValue="New Workflow"
					key="newWorkflow"
					href="/ai/workflows/new/"
				>
					New workflow
				</DropdownItem>

				<DropdownItem
					textValue="Run Workflow"
					key="runWorkflow"
					href="/ai/workflows/run/"
				>
					Run workflow
				</DropdownItem>

				<DropdownItem
					textValue="Generate Picture"
					key="generatePictureNew"
					href="/ai/generatePicture/new/"
				>
					Generate picture
				</DropdownItem>

				<DropdownItem
					textValue="Generate Picture"
					key="generatePicture"
					href="/ai/generatePicture/fromCharacter/"
				>
					Generate picture from character
				</DropdownItem>

				<DropdownItem
					textValue="Assets"
					key="Assets"
					href="/ai/datasets/"
				>
					Assets
				</DropdownItem>
				<DropdownItem
					textValue="Characters"
					key="Characters"
					href="/ai/characters/all/"
				>
					All Characters
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
};

export default UserDropdown;
