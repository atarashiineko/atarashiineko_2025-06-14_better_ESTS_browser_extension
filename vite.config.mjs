import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        background: resolve(__dirname, "src/background.js"),
        "content-script": resolve(__dirname, "src/content-script.js"),
        "popup/popup": resolve(__dirname, "popup/popup.html"),
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name][extname]",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
    manifest: false,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "manifest.json", dest: "." },
        { src: "icons", dest: "." },
      ],
    }),
  ],
});
