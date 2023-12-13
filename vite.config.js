import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/gym-app/",
  plugins: [
    react(),
    VitePWA({
      workbox: {
        // Use network first strategy for all requests
        // This will attempt to fetch the latest response from the network,
        // falling back to the cache if the network request fails.
        runtimeCaching: [
          {
            urlPattern: new RegExp(".*"), // Match all requests
            handler: "NetworkFirst",
          },
        ],
      },
      manifest: {
        name: "Gym Training App",
        short_name: "Gym App",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        start_url: "/gym-app/",
        display: "standalone",
        icons: [
          {
            src: "/gym-app/icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/gym-app/icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/gym-app/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/gym-app/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/gym-app/icon-152x152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "/gym-app/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/gym-app/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/gym-app/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
