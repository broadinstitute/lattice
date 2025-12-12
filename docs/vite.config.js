import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: "/",
  server: {
    port: 8000,
    fs: {
      allow: [resolve(__dirname, "..")],
    },
  },
});
