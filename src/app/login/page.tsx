"use client";
import { useState, useEffect, Key } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, Tab, Card, CardBody, Link } from "@nextui-org/react";
import SignupForm from "@/components/SignUpForm";
import LoginForm from "@/components/LoginForm";

export default function AuthPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const initialTab = searchParams.get("tab") || "login";
	const [selected, setSelected] = useState<Key>(initialTab);

	useEffect(() => {
		router.push(`?tab=${selected}`);
	}, [selected, router]);

	return (
		<div className="h-screen flex">
			<div className="hidden sm:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 justify-around items-center">
				<div>
					<h1 className="text-white font-bold text-4xl font-sans">Berchi</h1>
					<p className="text-white mt-1">Unleash your Appetite</p>
					<button
						type="button"
						className="block w-28 bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2"
					>
						Read More
					</button>
				</div>
			</div>
			<div className="flex w-screen sm:w-1/2 justify-center items-center bg-white">
				<Card className="max-w-full w-[340px]">
					<CardBody>
						<Tabs
							fullWidth
							size="md"
							aria-label="Tabs form"
							onSelectionChange={setSelected}
						>
							<Tab key="login" title="Login">
								<LoginForm />
								<p className="text-center text-small">
									Need to create an account?{" "}
									<Link size="sm" onPress={() => setSelected("sign-up")}>
										Sign up
									</Link>
								</p>
							</Tab>
							<Tab key="sign-up" title="Sign up">
								<SignupForm />
								<p className="text-center text-small">
									Already have an account?{" "}
									<Link size="sm" onPress={() => setSelected("login")}>
										Login
									</Link>
								</p>
							</Tab>
						</Tabs>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
