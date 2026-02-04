import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "CPA REG MCQ Practice",
        short_name: "CPA REG",
        start_url: ".",
        display: "standalone",
        theme_color: "#1e293b"
      }
    })
  ]
});
