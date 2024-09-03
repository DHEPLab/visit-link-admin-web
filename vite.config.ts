import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import browserslistToEsbuild from "browserslist-to-esbuild";
import path from "node:path";

export default defineConfig({
  publicDir: "./public",
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: "build",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          antd: ["antd"],
          lodash: ["lodash"],
          xlsx: ["xlsx"],
          quill: ["quill"],
          styled: ["@emotion/css", "@emotion/react", "@emotion/styled", "styled-components"],
          pcasCode: [path.resolve(__dirname, "src/constants/pcas-code.json")],
        },
      },
    },
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
