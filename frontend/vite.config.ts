// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    base: "/",
    build: { outDir: "dist" },

    // >>> pour Docker + HMR
    server: {
        //host: true,          // équivaut à 0.0.0.0
        port: 5173,
        strictPort: true,
        watch: { usePolling: true }, // utile sur Docker Desktop
        hmr: {
            clientPort: 5173,  // le port vu depuis ton navigateur
        },
    },
});
