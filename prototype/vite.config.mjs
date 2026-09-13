import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";

// One document contains the full wallpaper; no second network request or CSS replacement.
const embeddedBackground = {
  name: "embedded-study-background",
  transformIndexHtml: {
    order: "pre",
    handler(html) {
      const data = readFileSync(new URL("./public/juzizhou-study.png", import.meta.url)).toString("base64");
      return html.replace("__STUDY_BACKGROUND__", `data:image/png;base64,${data}`);
    },
  },
};

export default defineConfig({
  base: "/zhixu-site/",
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local", "localhost"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [embeddedBackground, react()],
});
