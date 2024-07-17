// components/Navbar.tsx
'use client';

import { Navbar, NavbarBrand, Link, Button, NavbarContent, NavbarItem } from "@nextui-org/react";
import LogoutButton from './LogoutButton';
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const GlobalNavbar = () => {
  const [isSignedIn,setIsSignedIn]=useState(false)
  const [showNavbar,setShowNavbar]=useState(true)
  const pathName=usePathname()
  useEffect(() => {

    const token = localStorage.getItem('access') || sessionStorage.getItem('access');
    if (token) {
      setIsSignedIn(true)
    }
    if (pathName=='/login'){
      console.log(pathName)
      setShowNavbar(false)
    }
    
  }, );
  return (
   
    <Navbar className={showNavbar?"":"hidden"} isBordered>
      <NavbarBrand>
        <p>
          LunchApp
        </p>
      </NavbarBrand>
      <NavbarContent>
        <Link href="/">Home</Link>
        {isSignedIn&&<Link href="/profile">Profile</Link>}
      </NavbarContent>
      <NavbarContent>
        {isSignedIn&&<LogoutButton />}
      </NavbarContent>
    </Navbar>
  );
};

export default GlobalNavbar;
