import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiTYcqp8TVQvzR4SFLw7-auLaeN1280_I",
  authDomain: "berchi-b12fb.firebaseapp.com",
  projectId: "berchi-b12fb",
  storageBucket: "berchi-b12fb.appspot.com",
  messagingSenderId: "244616800748",
  appId: "1:244616800748:web:56daa82c0d5bf5f8d4b8c9",
  measurementId: "G-J5VF2LJGP0"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: 'BL8qtFMA1jFvfi_wZcr1J0JFgZzYguJ3aFgQvv2oFXz7FFw5mXX2erEDBwgXxYgf9SV_ugi_usmqv0IGdVQ5_M8',
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };
