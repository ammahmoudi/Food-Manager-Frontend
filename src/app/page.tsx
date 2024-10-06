"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import Link from "next/link";

const RootPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Main Apps</h1>
      <div className="flex flex-col space-y-4">
        <Button
          as={Link}
          href="/ai" // Adjust this to your actual Maani app route
          variant="light"
          className="w-64"
        >
          Go to MAANI
        </Button>
        <Button
          as={Link}
          href="/berchi" // Adjust this to your actual Berchi app route
          variant="light"
          className="w-64"
        >
          Go to BERCHI
        </Button>
      </div>
    </div>
  );
};

export default RootPage;
