import { coverageConfigDefaults, defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      coverage: {
        reporter: ["html", "text", "json", "lcov"],
        exclude: ["build", "scripts", "src/models/**", "**/__mocks__/**", ...coverageConfigDefaults.exclude],
      },
      setupFiles: ["./vitest-setup.js"],
    },
  }),
);
