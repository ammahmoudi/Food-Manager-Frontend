import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Berchi',
    short_name: 'Br?',
    description: 'Master the Legends',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '006FEE',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}