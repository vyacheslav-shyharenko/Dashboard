// vite.config.js
import { defineConfig } from "vite";
import path from "path";
import { globSync } from "glob";
import FullReload from "vite-plugin-full-reload";
import viteImagemin from "vite-plugin-imagemin";

export default defineConfig(({ command }) => ({
  root: "src",
  base: "./",
  publicDir: "../public",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: command === "serve",
    rollupOptions: {
      input: Object.fromEntries(
        globSync(["./src/*.html", "./src/pages/**/*.html"]).map((file) => [
          path
            .relative(
              path.resolve(__dirname, "src"),
              file.slice(0, file.length - path.extname(file).length)
            )
            .replace(/\\/g, "/"),
          path.resolve(__dirname, file),
        ])
      ),
      output: {
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },

  plugins: [
    FullReload(["src/**/*.html", "src/**/*.scss", "src/**/*.js"]),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 75 },
      svgo: {
        plugins: [
          { name: "removeViewBox", active: false },
          { name: "cleanupIDs", active: false },
        ],
      },
    }),
  ],
}));
