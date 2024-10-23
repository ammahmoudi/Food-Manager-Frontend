"use client";

import React from "react";
import Link from "next/link";
import { Button, link } from "@nextui-org/react";
import { FaLinkedin, FaInstagram, FaTelegram } from 'react-icons/fa';
import { RiMailSendLine } from "react-icons/ri";
import { FaGithub } from "react-icons/fa6";

const RootPage: React.FC = () => {
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

        <div className="flex flex-col w-full h- full">
        <p className="text-lg mb-4">Created and designed by Soheil and AmirHossein</p>

<div className="flex justify-center space-x-4 mb-4">
    <Button as={link}
      isIconOnly
      href=""
    >
      <FaTelegram/>
    </Button>

    <Button as={link}
      isIconOnly
      href=""
    >
      <FaLinkedin/>
    </Button>

    <Button as={link}
      isIconOnly
      href=""
    >
      <FaInstagram/>
    </Button>

    <Button as={link}
      isIconOnly
      href=""
    >
      <RiMailSendLine/>
    </Button>

    <Button as={link}
      isIconOnly
      href=""
    >
      <FaGithub/>
    </Button>
</div>
        </div>
      </div>
    </div>
  );
};

export default RootPage;
