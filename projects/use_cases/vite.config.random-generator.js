import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "../../src/libs/RandomDataLib.js"),
      name: "RandomDataLib",
      formats: ["iife"],
      fileName: () => "js/random-generator.min.js",
    },
    outDir: "build",
    sourcemap: "inline",
  },
  server: {
    port: 3002,
  },
});
