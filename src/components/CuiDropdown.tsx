"use client";
import {
	Dropdown,
	DropdownTrigger,
	Button,
	DropdownMenu,
	DropdownItem,
	Link,
} from "@nextui-org/react";
import {
	PhotoIcon as PhotoIconSolid,
} from "@heroicons/react/24/solid";
import {
	PhotoIcon as PhotoIconOutline,
} from "@heroicons/react/24/outline";
import { useUser } from "@/context/UserContext";
import { useRouter } from 'next/navigation';

const UserDropdown = () => {
	const { user } = useUser();
	const router = useRouter();

	if (!user) {
		return <div>Loading...</div>;
	}


	return (
		<Dropdown placement="bottom-end" shouldCloseOnBlur>
			<DropdownTrigger>
				<Button
					as={Link}
					variant="light"
				
				startContent={<PhotoIconOutline  className="text-grey size-6"  />} // Button properties
				>
					<span className="hidden sm:inline">CumfyUI</span>
				</Button>
			</DropdownTrigger>
			<DropdownMenu aria-label="Profile Actions" variant="flat">
				<DropdownItem
					textValue="New Workflow"
					key="newWorkflow"
					href="/cui/workflow/new/"
				>
					New Workflow
				</DropdownItem>

				<DropdownItem
					textValue="Run Workflow"
					key="runWorkflow"
					href="/cui/workflow/run/"
				>
					Run Workflow
				</DropdownItem>

				<DropdownItem
					textValue="Generate Picture"
					key="generatePicture"
					href="/cui/workflow/generatePicture/"
				>
					Generate Picture 
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
};

export default UserDropdown;
