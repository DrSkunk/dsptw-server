import { svelte } from "@sveltejs/vite-plugin-svelte";
import fs from "fs";
import { resolve, join } from "path";
import { defineConfig } from "vite";
import { directoryPlugin } from "vite-plugin-list-directory-contents";

const htmlDir = resolve(__dirname, "src", "pages");

const htmlFiles = fs
  .readdirSync(htmlDir)
  .filter((file) => file.endsWith(".html") && file !== "index.html")
  .reduce((acc, file) => {
    const name = file.replace(".html", "");
    acc[name] = join(htmlDir, file);
    return acc;
  }, {});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    directoryPlugin({ baseDir: "src" }),
    svelte(),
    {
      name: "remove-pages-dir-from-html-path",
      enforce: "post",
      generateBundle(_, bundle) {
        const htmlFileInSrcFolderPattern = /^pages\/.*\.html$/;
        for (const outputItem of Object.values(bundle)) {
          if (!htmlFileInSrcFolderPattern.test(outputItem.fileName)) {
            continue;
          }
          outputItem.fileName = outputItem.fileName.replace("pages/", "");
        }
      },
    },
  ],
  root: "src",
  server: {
    open: "pages/",
  },
  build: {
    rollupOptions: {
      input: htmlFiles,
      external: [join(htmlDir, "index.html")],
    },
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
