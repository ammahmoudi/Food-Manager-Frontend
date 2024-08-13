// app/page.tsx
"use client";

import withAuth from "../components/withAuth";
import { useEffect, useState } from "react";
import { Card, CardBody, user } from "@nextui-org/react";
import { getMeals } from "../services/api";
import {useRouter} from "next/navigation";

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


export default withAuth(Home);
