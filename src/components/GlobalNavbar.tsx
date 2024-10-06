// src/components/GlobalNavbar.tsx
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
	SparklesIcon as SparklesIconSolid,
} from "@heroicons/react/24/solid";
import {
	HomeIcon as HomeIconOutline,
	CalendarIcon as CalendarIconOutline,
	InboxIcon as InboxIconOutline,
	CakeIcon as CakeIconOutline,
	PhotoIcon as PhotoIconOutline,
	SparklesIcon as SparklesIconOutline,
} from "@heroicons/react/24/outline";

import UserDropdown from "./UserDropdown";
import { useUser } from "@/context/UserContext";
import CuiDropdown from "../app/ai/components/CuiDropdown";
import { useTheme } from "../context/ThemeContext";
import React from "react";
import { Maani } from "@/icons/Maani";
import MaaniIcon from "@/icons/maaniIcon.svg";
import HumaaniDropdown from "@/app/ai/components/HumaaniDropdown";
// import {Mail} from "@/icons/Mail"

const GlobalNavbar = () => {
	const { isLoading, isAuthenticated } = useUser();
	const pathName = usePathname();
	const { currentTheme } = useTheme();

	const isActive = (path: string) => pathName === path;

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

	const navbarBrandName = pathName.startsWith("/ai") ? "MAANI" : "Berchi";

	return (
		<Navbar
			isBordered
			style={{
				backgroundColor: currentTheme.key === "ai" ? "#faf2db" : "#F5FFFA",
			}}
		>
			<NavbarBrand>
				{/* <Maani size={25} height={25} width={25}  fill={'#3d929D'}/> */}
				<Image
					src={MaaniIcon}
					className="text-black w-5 h-5"
					alt="Follow us on Twitter"
				/>
				<p className="font-bold text-inherit overflow-clip">
					{navbarBrandName}
				</p>
			</NavbarBrand>

			<NavbarContent>
				{isAuthenticated ? (
					<>
						{pathName.startsWith("/ai") ? (
							<>
								<Button
									as={Link}
									href="/ai/datasets"
									variant="light"
									startContent={getIcon(
										"/ai/datasets",
										PhotoIconSolid,
										PhotoIconOutline
									)}
									{...getButtonProps("/ai/datasets")}
								>
									<span className="hidden sm:inline">Assets</span>{" "}
								</Button>
								<HumaaniDropdown />
								<CuiDropdown />
							</>
						) : (
							<>
								<Button
									as={Link}
									href="/home"
									variant="light"
									startContent={getIcon(
										"/home",
										HomeIconSolid,
										HomeIconOutline
									)}
									{...getButtonProps("/home")}
								>
									<span className="hidden sm:inline">Home</span>
								</Button>
								<CuiDropdown />

								<Button
									as={Link}
									href="/calendar"
									variant="light"
									startContent={getIcon(
										"/calendar",
										CalendarIconSolid,
										CalendarIconOutline
									)}
									{...getButtonProps("/calendar")}
								>
									<span className="hidden sm:inline">Calendar</span>
								</Button>
								<Button
									as={Link}
									href="/berchi/meals"
									variant="light"
									startContent={getIcon(
										"/berchi/meals",
										InboxIconSolid,
										InboxIconOutline
									)}
									{...getButtonProps("/berchi/meals")}
								>
									<span className="hidden sm:inline">Meals</span>
								</Button>
								<Button
									as={Link}
									href="/berchi/foods"
									variant="light"
									startContent={getIcon(
										"/berchi/foods",
										CakeIconSolid,
										CakeIconOutline
									)}
									{...getButtonProps("/berchi/foods")}
								>
									<span className="hidden sm:inline">Foods</span>
								</Button>
							</>
						)}
					</>
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
