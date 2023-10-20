import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  root: "src",
  base: "./",
  build: {
    rollupOptions: {
      input: {
        drieZesNegen: resolve(__dirname, "src", "drie-zes-negen.html"),
        players: resolve(__dirname, "src", "players.html"),
      },
    },
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
