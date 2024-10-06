"use client";

import React from "react";
import {
  Button,
  Link,
  Card,
  CardBody,
} from "@nextui-org/react";
import {
  PhotoIcon as PhotoIconSolidFilled,
} from "@heroicons/react/24/solid";
import HumaaniDropdown from "@/app/ai/components/HumaaniDropdown";
import CuiDropdown from "@/app/ai/components/CuiDropdown";

const MainPage: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
      {/* Background image using a div */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/maani_bg_1.png')",					backgroundAttachment: 'fixed',
        }} // Update with your image path
      ></div>
      
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

      {/* Card to wrap content */}
      <Card
        isBlurred
        className="border-none bg-black bg-background/50 dark:bg-default-100/50 max-w-[610px] z-20 p-4"
        shadow="sm"
      >
        <CardBody>
          <h1 className="text-3xl font-bold mb-6 text-white">Welcome to Manni</h1>
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
        </CardBody>
      </Card>
    </div>
  );
};

export default MainPage;
