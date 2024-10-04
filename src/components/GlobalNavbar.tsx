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
	HomeIcon as HomeIconSolid,
	CalendarIcon as CalendarIconSolid,
	InboxIcon as InboxIconSolid,
	CakeIcon as CakeIconSolid,
} from "@heroicons/react/24/solid";
import {
	HomeIcon as HomeIconOutline,
	CalendarIcon as CalendarIconOutline,
	InboxIcon as InboxIconOutline,
	CakeIcon as CakeIconOutline,
} from "@heroicons/react/24/outline";


import UserDropdown from "./UserDropdown";
import { useUser } from "@/context/UserContext";
import CuiDropdown from "./CuiDropdown";
import React from "react";

const GlobalNavbar = () => {
	const { isLoading, isAuthenticated } = useUser();
	// const [showNavbar, setShowNavbar] = useState(true);
	// setShowNavbar(true);
	const pathName = usePathname();

	// Helper to determine if the current page matches the path
	const isActive = (path: string) => pathName === path;

	// Define the button styles based on the active state
	const getButtonProps = (path: string) => ({
		underline: isActive(path) ? "always" : "hover",
		className:
			"my-0 p-2 w-fit min-w-0 " +
			(isActive(path) ? "text-primary font-bold" : "text-gray"),
	});

	// Icons based on the active state
	const getIcon = (
		path: string,
		SolidIcon: React.ForwardRefExoticComponent<
			React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
				title?: string;
				titleId?: string;
			} & React.RefAttributes<SVGSVGElement>
		>,
		OutlineIcon: React.ForwardRefExoticComponent<
			React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
				title?: string;
				titleId?: string;
			} & React.RefAttributes<SVGSVGElement>
		>
	) =>
		isActive(path) ? (
			<SolidIcon className="w-5 h-5" />
		) : (
			<OutlineIcon className="w-5 h-5" />
		);

	return (
		<Navbar isBordered>
			<NavbarBrand>
				<p className="font-bold text-inherit overflow-clip">Berchi</p>
			</NavbarBrand>

			<NavbarContent>
			{isAuthenticated ? (
				<>
				<Button
					as={Link}
					href="/home"
					variant="light"
					startContent={getIcon("/home", HomeIconSolid, HomeIconOutline)}
					{...getButtonProps("/home")}
				>
					<span className="hidden sm:inline">Home</span>
				</Button>
				<CuiDropdown/>


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
					startContent={getIcon("/berchi/meals", InboxIconSolid, InboxIconOutline)}
					{...getButtonProps("/berchi/meals")}
				>
					<span className="hidden sm:inline">Meals</span>
				</Button>
				<Button
					as={Link}
					href="/berchi/foods"
					variant="light"
					startContent={getIcon("/berchi/foods", CakeIconSolid, CakeIconOutline)}
					{...getButtonProps("/berchi/foods")}
				>
					<span className="hidden sm:inline">Foods</span>
				</Button>
				</>):
				(
					'Master the Legends'

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
