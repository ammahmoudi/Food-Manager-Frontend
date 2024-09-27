// import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { CacheFirst, Serwist, StaleWhileRevalidate } from 'serwist';

// // Declare the service worker manifest
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Initialize Serwist service worker
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Handle images
    {
      matcher({ request }) {
        return request.destination === "image";
      },
      handler: new StaleWhileRevalidate({
        cacheName: "images",
      }),
    },
    // Handle scripts
    {
      matcher({ request }) {
        return request.destination === "script";
      },
      handler: new CacheFirst({
        cacheName: "scripts",
      }),
    },
    // Handle styles
    {
      matcher({ request }) {
        return request.destination === "style";
      },
      handler: new CacheFirst({
        cacheName: "styles",
      }),
    },
  ],  fallbacks: {
    entries: [
      {
        url: "/fallback",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
  
  // This will provide default caching strategies

});
// serwist.registerCapture(({ request, sameOrigin }) => {
//   return sameOrigin && request.destination === "image";
// }, new CacheFirst());


// self.addEventListener("push", (event) => {
//   const data = JSON.parse(event.data?.text() ?? '{ title: "" }');
//   event.waitUntil(
//     self.registration.showNotification(data.title, {
//       body: data.message,
//       icon: "/icons/android-chrome-192x192.png",
//     }),
//   );
// });

// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();
//   event.waitUntil(
//     self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
//       if (clientList.length > 0) {
//         let client = clientList[0];
//         for (let i = 0; i < clientList.length; i++) {
//           if (clientList[i].focused) {
//             client = clientList[i];
//           }
//         }
//         return client.focus();
//       }
//       return self.clients.openWindow("/");
//     }),
//   );
// });

serwist.addEventListeners();
