"use client";

import { useEffect, useRef, useState } from "react";
import { onMessage, Unsubscribe } from "firebase/messaging";
import { fetchToken, messaging } from "@/services/firebase";
import { useRouter } from "next/navigation";
import { subscribeUser } from "@/services/api";
import { toast } from "sonner";
import {Button, Image} from "@nextui-org/react"
import { LinkIcon } from "@heroicons/react/24/solid";

async function getNotificationPermissionAndToken() {
	// Step 1: Check if Notifications are supported in the browser.
	if (!("Notification" in window)) {
		console.info("This browser does not support desktop notification");
		return null;
	}

	// Step 2: Check if permission is already granted.
	if (Notification.permission === "granted") {
		return await fetchToken();
	}

	// Step 3: If permission is not denied, request permission from the user.
	if (Notification.permission !== "denied") {
		const permission = await Notification.requestPermission();
		if (permission === "granted") {
			return await fetchToken();
		}
	}
	return null;
}

const useFcmToken = () => {
	const router = useRouter(); // Initialize the router for navigation.
	const [notificationPermissionStatus, setNotificationPermissionStatus] =
		useState<NotificationPermission | null>(null); // State to store the notification permission status.
	const [token, setToken] = useState<string | null>(null); // State to store the FCM token.
	const retryLoadToken = useRef(0); // Ref to keep track of retry attempts.
	const isLoading = useRef(false); // Ref to keep track if a token fetch is currently in progress.

	const loadToken = async () => {
		// Step 4: Prevent multiple fetches if already fetched or in progress.
		if (isLoading.current) return;

		isLoading.current = true; // Mark loading as in progress.
		const token = await getNotificationPermissionAndToken(); // Fetch the token.

		// Step 5: Handle the case where permission is denied.
		if (Notification.permission === "denied") {
			setNotificationPermissionStatus("denied");
			console.info(
				"%cPush Notifications issue - permission denied",
				"color: green; background: #c7c7c7; padding: 8px; font-size: 20px"
			);
			isLoading.current = false;
			return;
		}

		// Step 6: Retry fetching the token if necessary. (up to 3 times)
		// This step is typical initially as the service worker may not be ready/installed yet.
		if (!token) {
			if (retryLoadToken.current >= 3) {
				alert("Unable to load token, refresh the browser");
				console.info(
					"%cPush Notifications issue - unable to load token after 3 retries",
					"color: green; background: #c7c7c7; padding: 8px; font-size: 20px"
				);
				isLoading.current = false;
				return;
			}

			retryLoadToken.current += 1;
			console.error("An error occurred while retrieving token. Retrying...");
			isLoading.current = false;
			await loadToken();
			return;
		}

		// Step 7: Set the fetched token and mark as fetched.
		setNotificationPermissionStatus(Notification.permission);
		setToken(token);
		isLoading.current = false;
	};

	useEffect(() => {
		// Step 8: Initialize token loading when the component mounts.
		if ("Notification" in window) {
			loadToken();
		}
	}, []);

	useEffect(() => {
		const setupListener = async () => {
			if (!token) return; // Exit if no token is available.
			// Send the FCM token to your backend to subscribe the user
			try {
				await subscribeUser(token);
			} catch (error) {
				console.error("Subscription failed:", error);
			}
			const m = await messaging();
			if (!m) return;

			// Step 9: Register a listener for incoming FCM messages.
			const unsubscribe = onMessage(m, (payload) => {
	if (Notification.permission !== "granted") return;
	const link = payload.fcmOptions?.link || payload.data?.link;
	const imageUrl = payload.notification?.image; // Get the image URL from the notification payload

	toast(
		<div className="flex flex-row gap-2 w-full" >
				{imageUrl && (
				<Image
					src={imageUrl}
					alt="Notification Image"
					className="rounded-lg h-10 aspect-square w-10 basis-1/4 "
					classNames={{ wrapper: "w-full h-full aspect-square " }}


				/>
			)}
				<div className="flex flex-col flex-grow w-full">
				<div className="flex flex-row flex-grow gap-2 w-full">
				<div className="flex flex-col flex-grow w-full">

				<span className="font-bold flex flex-grow">{payload.notification?.title}</span>
				<span>{payload.notification?.body}</span>
</div>
				{link && (
					<div className="flex-grow-0">
					<Button  
					radius="full"
					size="sm"
					isIconOnly
					className="bg-primary text-white"
					onClick={() => router.push(link)}
					>
						<LinkIcon  className="h-5 w-5" />
					</Button>
					</div>
				)}
					
					</div>
				</div>
				
				
		</div>
	);
});

			return unsubscribe;
		};

		let unsubscribe: Unsubscribe | null = null;

		setupListener().then((unsub) => {
			if (unsub) {
				unsubscribe = unsub;
			}
		});

		// Step 11: Cleanup the listener when the component unmounts.
		return () => unsubscribe?.();
	}, [token, router]);

	return { token, notificationPermissionStatus }; // Return the token and permission status.
};

export default useFcmToken;
