"use client";

import {
  Navbar,
  NavbarBrand,
  Button,
  NavbarContent,
  Link,
  Image,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import {
  HomeIcon as HomeIconSolid,
  CalendarIcon as CalendarIconSolid,
  InboxIcon as InboxIconSolid,
  CakeIcon as CakeIconSolid,
  PhotoIcon as PhotoIconSolid,
} from "@heroicons/react/24/solid";
import {
  HomeIcon as HomeIconOutline,
  CalendarIcon as CalendarIconOutline,
  InboxIcon as InboxIconOutline,
  CakeIcon as CakeIconOutline,
  PhotoIcon as PhotoIconOutline,
} from "@heroicons/react/24/outline";

import UserDropdown from "./UserDropdown";
import { useUser } from "@/context/UserContext";
import CuiDropdown from "../app/ai/components/CuiDropdown";
import { useTheme } from "../context/ThemeContext";
import React from "react";
import MaaniIcon from "@/icons/maaniIcon.svg";
import HumaaniDropdown from "@/app/ai/components/HumaaniDropdown";

// Define a type for navigation items
interface NavItem {
  path: string;
  label: string;
  solidIcon: React.ElementType;
  outlineIcon: React.ElementType;
}

const GlobalNavbar = () => {
  const { isLoading, isAuthenticated } = useUser();
  const pathName = usePathname();
  const { currentTheme } = useTheme();

  // Define structured navigation items for different applications
  const navItems = [
    {
      app: "Maani",
      basePath: "/ai",
      items: [
        {
          path: "datasets", // Changed to relative path
          label: "Assets",
          solidIcon: PhotoIconSolid,
          outlineIcon: PhotoIconOutline,
        },
      ],
      dropdowns: [<HumaaniDropdown />, <CuiDropdown />],
    },
    {
      app: "Berchi",
      basePath: "/berchi",
      items: [
        // {
        //   path: "home", // Changed to relative path
        //   label: "Home",
        //   solidIcon: HomeIconSolid,
        //   outlineIcon: HomeIconOutline,
        // },
        {
          path: "calendar", // Changed to relative path
          label: "Calendar",
          solidIcon: CalendarIconSolid,
          outlineIcon: CalendarIconOutline,
        },
        {
          path: "meals", // Changed to relative path
          label: "Meals",
          solidIcon: InboxIconSolid,
          outlineIcon: InboxIconOutline,
        },
        {
          path: "foods", // Changed to relative path
          label: "Foods",
          solidIcon: CakeIconSolid,
          outlineIcon: CakeIconOutline,
        },
      ],
      dropdowns: [],
    },
  ];

  const isActive = (path: string) => pathName === path;

  const getButtonProps = (path: string) => ({
    underline: isActive(path) ? "always" : "hover",
    className: "my-0 p-2 w-fit min-w-0 " + (isActive(path) ? "text-primary font-bold" : "text-gray"),
  });

  const getIcon = (path: string, SolidIcon: React.ElementType, OutlineIcon: React.ElementType) =>
    isActive(path) ? <SolidIcon className="w-5 h-5" /> : <OutlineIcon className="w-5 h-5" />;

  // Set the navbar brand name and link based on the pathname
  const currentApp = navItems.find(app => pathName.startsWith(app.basePath));
  const navbarBrandName = currentApp ? currentApp.app : "Rasta";
  const brandLink = currentApp ? currentApp.basePath : "/";

  return (
    <Navbar
      isBordered
            // className={currentTheme.key === "ai" ? "bg-[#faf2db]" : "bg-[#F5FFFA]"}
    >
      <NavbarBrand>
        <Link href={brandLink}>
          <Image src={MaaniIcon} className="text-black w-5 h-5" alt="Brand Icon" />
          <p className="font-bold text-inherit overflow-clip">{navbarBrandName}</p>
        </Link>
      </NavbarBrand>

      <NavbarContent>
        {isAuthenticated ? (
          pathName === "/" ? (
<></>          ) : (
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
                        startContent={getIcon(`${app.basePath}/${item.path}`, item.solidIcon, item.outlineIcon)}
                        {...getButtonProps(`${app.basePath}/${item.path}`)}
                      >
                        <span className="hidden sm:inline">{item.label}</span>
                      </Button>
                    ))}
                    {app.dropdowns.map((DropdownComponent, index) => (
                      <React.Fragment key={index}>{DropdownComponent}</React.Fragment>
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
          <UserDropdown />
        ) : (
          <Button as={Link} isLoading={isLoading} href="/login" variant="ghost">
            Sign In
          </Button>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default GlobalNavbar;
