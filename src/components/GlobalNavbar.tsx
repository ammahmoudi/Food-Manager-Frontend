// components/Navbar.tsx
"use client";

import {
	Navbar,
	NavbarBrand,
	Link,
	Button,
	NavbarContent,
	NavbarItem,
	DropdownTrigger,
	DropdownItem,
	DropdownMenu,
	Avatar,
	Dropdown,
} from "@nextui-org/react";
import LogoutButton from "./LogoutButton";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import UserDropdown from "./UserDropdown";

const GlobalNavbar = () => {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [showNavbar, setShowNavbar] = useState(true);
	const pathName = usePathname();
	useEffect(() => {
		const token =
			localStorage.getItem("access") || sessionStorage.getItem("access");
		if (token) {
			setIsSignedIn(true);
		}
		if (pathName == "/login") {
			setShowNavbar(false);
		}
	}, [pathName]);
	return (
		<Navbar className={showNavbar ? "" : "hidden"} isBordered>
			<NavbarBrand>
				<p className="font-bold text-inherit">Berchi</p>
			</NavbarBrand>
			<NavbarContent>
				<Link href="/home">Home</Link>
        <Link href="/calendar">Calendar</Link>
        <Link href="/meals">Meals</Link>
				<Link href="/foods">Foods</Link>

			</NavbarContent>
			<NavbarContent as="div" justify="end">
				{isSignedIn ? (
					<UserDropdown />
				) : (
					<Button href="/login">Sign In</Button>
				)}
			</NavbarContent>
		</Navbar>
	);
};

export default GlobalNavbar;
