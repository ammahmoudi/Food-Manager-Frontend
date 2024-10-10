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
    WrenchScrewdriverIcon as WrenchScrewdriverIconOutline,
    DocumentPlusIcon,
    PlayIcon,
} from "@heroicons/react/24/outline";

const AdminToolsDropdown = () => {
    return (
        
        <Dropdown placement="bottom-end" shouldCloseOnBlur>
            <DropdownTrigger>
                <Button
                    as={Link}
                    variant="light"
                    startContent={<WrenchScrewdriverIconOutline className="text-grey size-6" />} // Button properties
                >
                    <span className="hidden sm:inline">Admin Tools</span>
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Admin Tools" variant="flat">
                <DropdownItem
                    textValue="New Workflow"
                    key="newWorkflow"
                    href="/ai/workflows/new/"
                    startContent={<DocumentPlusIcon className="text-grey size-5" />}
                >
                    New Workflow
                </DropdownItem>

                <DropdownItem
                    textValue="Run Workflow"
                    key="runWorkflow"
                    href="/ai/workflows/run/"
                    startContent={<PlayIcon className="text-grey size-5" />}
                >
                    Run Workflow
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

export default AdminToolsDropdown;
