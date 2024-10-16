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
    UserGroupIcon as UserGroupIconOutline,
    UserIcon,
    PlusIcon,
    PhotoIcon,
    DocumentIcon, // Assuming this icon represents LoRA requests, you can change it if needed
} from "@heroicons/react/24/outline";

const HumaaniDropdown = () => {
    return (
        <Dropdown placement="bottom-end" shouldCloseOnBlur>
            <DropdownTrigger>
                <Button
                    as={Link}
                    variant="light"
                    startContent={<UserGroupIconOutline className="text-grey size-6" />} // Button properties
                >
                    <span className="hidden sm:inline">Humaani</span>
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Profile Actions"
                className="w-[340px]"
                itemClasses={{
                    base: "gap-4",
                }}
            >
                <DropdownItem
                    textValue="Characters"
                    key="Characters"
                    href="/ai/characters/"
                    startContent={<UserIcon className="text-grey size-5" />}
                    description="View all created characters and manage their details."
                >
                    Characters
                </DropdownItem>
                <DropdownItem
                    textValue="New Character"
                    key="NewCharacter"
                    href="/ai/generatePicture/new/"
                    startContent={<PlusIcon className="text-grey size-5" />}
                    description="Create a new character from scratch."
                >
                    New Character
                </DropdownItem>
                <DropdownItem
                    textValue="Generate Image from Character"
                    key="generatePictureFromCharacter"
                    href="/ai/generatePicture/fromCharacter/"
                    startContent={<PhotoIcon className="text-grey size-5" />}
                    description="Generate images based on an existing character."
                >
                    Generate Image from Character
                </DropdownItem>
                <DropdownItem
                    textValue="LoRA Requests"
                    key="loraRequests"
                    href="/ai/lora/requests"
                    startContent={<DocumentIcon className="text-grey size-5" />}
                    description="Manage and view LoRA training requests."
                >
                    LoRA Requests
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

export default HumaaniDropdown;
