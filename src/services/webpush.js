import 'firebase/messaging';
import firebase from 'firebase/app';
import localforage from 'localforage';
const firebaseCloudMessaging = {
//checking whether token is available in indexed DB
tokenInlocalforage: async () => {
return localforage.getItem('fcm_token');
},
//initializing firebase app
init: async function () {
if (!firebase.apps.length) {
firebase.initializeApp({
 messagingSenderId: 244616800748
});
try {
const messaging = firebase.messaging();
const tokenInLocalForage = await this.tokenInlocalforage();
//if FCM token is already there just return the token
if (tokenInLocalForage !== null) {
return tokenInLocalForage;
}
//requesting notification permission from browser
const status = await Notification.requestPermission();
if (status && status === 'granted') {
//getting token from FCM
const fcm_token = await messaging.getToken();
if (fcm_token) {
//setting FCM token in indexed db using localforage
localforage.setItem('fcm_token', token);
console.log('fcm token', token);
//return the FCM token after saving it
return token;
}
}
} catch (error) {
console.error(error);
return null;
}
}
},
};
export { firebaseCloudMessaging };