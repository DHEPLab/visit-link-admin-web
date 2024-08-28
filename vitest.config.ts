import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      coverage: {
        reporter: ["html", "text", "json", "lcov"]
      },
      setupFiles: ["./vitest-setup.js"],
      exclude: ["**/node_modules/**", "**/dist/**", "**/.{idea,git,cache,output,temp}/**", "./src/config/**"],
    },
  })
);
