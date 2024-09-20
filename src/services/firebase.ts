"use client";

// firebase.ts
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getToken, MessagePayload, onMessage } from "firebase/messaging";

import { getMessaging } from "firebase/messaging/sw";

const firebaseConfig = {
	apiKey: "AIzaSyDiTYcqp8TVQvzR4SFLw7-auLaeN1280_I",
	authDomain: "berchi-b12fb.firebaseapp.com",
	projectId: "berchi-b12fb",
	storageBucket: "berchi-b12fb.appspot.com",
	messagingSenderId: "244616800748",
	appId: "1:244616800748:web:56daa82c0d5bf5f8d4b8c9",
	measurementId: "G-J5VF2LJGP0",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const messaging = getMessaging(app);
export const requestPermission = async () => {
	try {
		const permission = await Notification.requestPermission();
		if (permission === "granted") {
			try {
				const token = await getToken(messaging, {
					vapidKey:
						"BL8qtFMA1jFvfi_wZcr1J0JFgZzYguJ3aFgQvv2oFXz7FFw5mXX2erEDBwgXxYgf9SV_ugi_usmqv0IGdVQ5_M8", // Use the VAPID key generated from Firebase
				});
				if (token) {
					console.log("FCM token:", token);
					return token;
				} else {
					console.log("No FCM token available");
					return null;
				}
			} catch (error) {
				console.error("Error getting FCM token:", error);
				return null;
			}
			// Send token to backend if needed
		} else {
			console.error("Permission not granted for notifications");
		}
	} catch (error) {
		console.error("Error getting token", error);
	}
};

requestPermission();

export const onMessageListener = (): Promise<MessagePayload> =>
	new Promise((resolve) => {
		onMessage(messaging, (payload: MessagePayload) => {
			resolve(payload);
		});
	});