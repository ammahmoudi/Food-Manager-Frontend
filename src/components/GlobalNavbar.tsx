"use client";

import {
  Navbar,
  NavbarBrand,
  Button,
  NavbarContent,
  Link,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import {
  CalendarIcon as CalendarIconSolid,
  InboxIcon as InboxIconSolid,
  CakeIcon as CakeIconSolid,
  PhotoIcon as PhotoIconSolid,
  BugAntIcon,
} from "@heroicons/react/24/solid"; // Import Bug Icon
import {
  CalendarIcon as CalendarIconOutline,
  InboxIcon as InboxIconOutline,
  CakeIcon as CakeIconOutline,
  PhotoIcon as PhotoIconOutline,
} from "@heroicons/react/24/outline";

import UserDropdown from "./UserDropdown";
import { useUser } from "@/context/UserContext";
import React, { useState } from "react"; // Import useState
import BugReportModal from "@/components/modals/feedback"; // Import the modal
import HumaaniDropdown from "@/app/humaani/components/HumaaniDropdown";
import { MaaniIcon } from "@/icons/MaaniIcon"; // Maani icon component for NavbarBrand
import { BerchiIcon } from "@/icons/BerchiIcon";
import AdminToolsDropdown from "../app/humaani/components/AdminToolsDropdown";

// Define a type for navigation items
interface NavItem {
  path: string;
  label: string;
  solidIcon: React.ElementType;
  outlineIcon: React.ElementType;
}

// Define a type for app navigation structure
interface AppNav {
  app: string;
  icon: React.ElementType;
  basePath: string;
  items: NavItem[];
  dropdowns: React.ReactNode[];
}

const GlobalNavbar = () => {
  const { isLoading, isAuthenticated, isAdmin } = useUser();
  const pathName = usePathname();
  const [isBugModalOpen, setBugModalOpen] = useState(false); // State for modal

  const handleOpenBugModal = () => setBugModalOpen(true); // Open modal
  const handleCloseBugModal = () => setBugModalOpen(false); // Close modal

  // Define structured navigation items for different applications, including app icons
  const navItems: AppNav[] = [
    {
      app: "Maani",
      icon: MaaniIcon,
      basePath: "/humaani",
      items: [
        {
          path: "datasets",
          label: "Assets",
          solidIcon: PhotoIconSolid,
          outlineIcon: PhotoIconOutline,
        },
      ],
      dropdowns: [
        <HumaaniDropdown key="humaani" />,
        isAdmin && <AdminToolsDropdown key="cui" />,
      ],
    },
    {
      app: "Berchi",
      icon: BerchiIcon,
      basePath: "/berchi",
      items: [
        {
          path: "calendar",
          label: "Calendar",
          solidIcon: CalendarIconSolid,
          outlineIcon: CalendarIconOutline,
        },
        {
          path: "meals",
          label: "Meals",
          solidIcon: InboxIconSolid,
          outlineIcon: InboxIconOutline,
        },
        {
          path: "foods",
          label: "Foods",
          solidIcon: CakeIconSolid,
          outlineIcon: CakeIconOutline,
        },
      ],
      dropdowns: [],
    },
  ];

  const isActive = (path: string) => pathName.startsWith(path);

  const getButtonProps = (path: string) => ({
    underline: isActive(path) ? "always" : "hover",
    className:
      "my-0 p-2 w-fit min-w-0 " +
      (isActive(path) ? "text-primary font-bold" : "text-gray"),
  });

  const getIcon = (
    path: string,
    SolidIcon: React.ElementType,
    OutlineIcon: React.ElementType
  ) =>
    isActive(path) ? (
      <SolidIcon className="w-5 h-5" />
    ) : (
      <OutlineIcon className="w-5 h-5" />
    );

  // Set the navbar brand name, link, and app icon based on the pathname
  const currentApp = navItems.find((app) => pathName.startsWith(app.basePath));
  const navbarBrandName = currentApp ? currentApp.app : "Rastar";
  const brandLink = currentApp ? currentApp.basePath : "/";
  const BrandIcon = currentApp ? currentApp.icon : MaaniIcon; // Default icon if no match

  return (
    <>
      <Navbar
        isBlurred
        className="sm:sticky sm:top-0 fixed bottom-0 top-auto left-0 w-full z-50"
        classNames={{
          base: "sm:sticky sm:top-0 fixed bottom-0 left-0 w-full z-50",
        }}
      >
        <NavbarBrand>
          <Link href={brandLink}>
            <BrandIcon className="w-8 h-8 text-black " />
            <span className="font-bold  text-black overflow-clip ml-2 hidden sm:inline">
              {navbarBrandName}
            </span>
          </Link>
        </NavbarBrand>

        <NavbarContent>
          {isAuthenticated ? (
            pathName === "/" ? (
              <></>
            ) : (
              navItems.map((app) => {
                if (pathName.startsWith(app.basePath)) {
                  return (
                    <React.Fragment key={app.app}>
                      {app.items.map((item) => (
                        <Button
                          key={item.path}
                          as={Link}
                          href={`${app.basePath}/${item.path}`} // Use basePath here
                          variant="light"
                          startContent={getIcon(
                            `${app.basePath}/${item.path}`,
                            item.solidIcon,
                            item.outlineIcon
                          )}
                          {...getButtonProps(`${app.basePath}/${item.path}`)}
                        >
                          <span className="hidden sm:inline">{item.label}</span>
                        </Button>
                      ))}
                      {app.dropdowns.map((DropdownComponent, index) => (
                        <React.Fragment key={index}>
                          {DropdownComponent}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  );
                }
                return null;
              })
            )
          ) : (
            "Master the Legends"
          )}
        </NavbarContent>
        <NavbarContent as="div" justify="end">
          {isAuthenticated ? (
            <>
              <Button
                variant="light"
                startContent={<BugAntIcon className="w-5 h-5" />} // Bug icon
                onPress={handleOpenBugModal}
              ></Button>
              <UserDropdown />
            </>
          ) : (
            <Button
              as={Link}
              isLoading={isLoading}
              href="/login"
              variant="ghost"
            >
              Sign In
            </Button>
          )}
        </NavbarContent>
      </Navbar>

      {/* Bug Report Modal */}
      <BugReportModal visible={isBugModalOpen} onClose={handleCloseBugModal} />
    </>
  );
};

export default GlobalNavbar;
