import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "next/link": fileURLToPath(new URL("./src/shims/next-link.tsx", import.meta.url)),
      "next/font/google": fileURLToPath(new URL("./src/shims/next-font-google.ts", import.meta.url)),
    },
  },
});