import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import browserslistToEsbuild from "browserslist-to-esbuild";
import VitePluginSvgSpritemap from "@spiriit/vite-plugin-svg-spritemap";

export default defineConfig({
  publicDir: "./public",
  plugins: [
    react(),
    tsconfigPaths(),
    VitePluginSvgSpritemap("./src/icons/*.svg", {
      prefix: false,
      output: {
        view: false,
        use: false,
      },
      idify: (name) => name,
    }),
  ],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          antd: ["antd"],
          xlsx: ["xlsx"],
          quill: ["quill"],
          styled: ["@emotion/css", "@emotion/react", "@emotion/styled", "styled-components"],
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
  preview: {
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
