import vue from "@vitejs/plugin-vue";
import * as fs from "fs";
import { defineConfig, loadEnv } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const faviconCode = fs.readFileSync("../logo/favicon/html_code.html", "utf8");

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../", "");
  return {
    envDir: "../",
    plugins: [
      {
        name: "include-favicon-code",
        enforce: "pre",
        transformIndexHtml(html: string) {
          const basedFaviconCode = faviconCode.replaceAll(
            `href="/`,
            `href="${env.VUE_BASE_URL}`,
          );
          return html.replace("<!-- faviconGenerator -->", basedFaviconCode);
        },
      },
      vue(),
      viteStaticCopy({
        targets: [
          {
            src: "../logo/favicon/*.{png,xml,ico,svg,webmanifest}",
            dest: ".",
          },
        ],
      }),
    ],
    server: {
      port: Number(env.VUE_DEV_SERVER_PORT),
      strictPort: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("prime")) {
              return "primefaces";
            } else if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
    },
    mode,
    base: env.VUE_BASE_URL,
  };
});
