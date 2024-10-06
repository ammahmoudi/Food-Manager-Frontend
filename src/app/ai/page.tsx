"use client";

import React from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Link
} from "@nextui-org/react";
import {
  WrenchScrewdriverIcon as WrenchScrewdriverIconOutline,
  UserGroupIcon as UserGroupIconOutline,
  PhotoIcon as PhotoIconSolid,
  PhotoIcon as PhotoIconOutline,
} from "@heroicons/react/24/outline";
import {
  PhotoIcon as PhotoIconSolidFilled,
} from "@heroicons/react/24/solid";
import HumaaniDropdown from "@/app/ai/components/HumaaniDropdown";
import CuiDropdown from "@/app/ai/components/CuiDropdown";

const MainPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to Manni</h1>

      <div className="flex flex-col space-y-4">
        <Button
          as={Link}
          href="/ai/datasets"
          variant="light"
          startContent={<PhotoIconSolidFilled className="w-5 h-5" />}
        >
          <span className="hidden sm:inline">Assets</span>
        </Button>
        {/* Add other buttons or dropdowns as needed */}
        <HumaaniDropdown />
        <CuiDropdown />
      </div>
    </div>
  );
};

export default MainPage;
