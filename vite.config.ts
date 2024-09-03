import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import browserslistToEsbuild from "browserslist-to-esbuild";

export default defineConfig({
  publicDir: "./public",
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: "build",
    emptyOutDir: true,
    target: browserslistToEsbuild(),
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    proxy: {
      "/api": {
        target: process.env.BACKEND_PROXY_TARGET || "http://localhost:8080",
        changeOrigin: true,
      },
      "/admin": {
        target: process.env.BACKEND_PROXY_TARGET || "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
