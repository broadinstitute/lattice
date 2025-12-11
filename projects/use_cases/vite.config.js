import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "../../src/libs/LatticeLib.js"),
      name: "LatticeLib",
      formats: ["iife"],
      fileName: () => "js/lattice-lib.min.js",
    },
    outDir: "build",
    sourcemap: "inline",
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: "css/lattice-lib.min[extname]",
      },
    },
  },
  server: {
    port: 8002,
  },
});
