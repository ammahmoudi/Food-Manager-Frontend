"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { FaLinkedin, FaInstagram, FaTelegram } from 'react-icons/fa';
import { RiMailSendLine } from "react-icons/ri";
import { FaGithub } from "react-icons/fa6";

const RootPage: React.FC = () => {
  console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Main Apps</h1>
      <div className="flex flex-col space-y-4">
        <Button
          as={Link}
          href="/humaani"
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

        <div className="flex flex-row w-full h- full">
        <p className="text-lg mb-4">Created and designed by Soheil and AmirHossein</p>
              <FaTelegram/>
              <FaLinkedin/>
              <FaInstagram/>
              <RiMailSendLine/>
              <FaGithub/>
        </div>
      </div>
    </div>
  );
};

export default RootPage;
