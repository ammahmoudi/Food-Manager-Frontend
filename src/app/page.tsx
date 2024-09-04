// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, user } from "@nextui-org/react";
import { getMeals } from "../services/api";
import {useRouter} from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Meal {
	id: number;
	food: {
		name: string;
		description: string;
	};
	date: string;
}

const Home = () => {
	const router=useRouter();
	router.push('/home')
	return('')
};


export default Home;
