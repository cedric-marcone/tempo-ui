import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// const ReactCompilerConfig = {};

export default defineConfig({
  plugins: [
    react(),
    // {
    //   babel: {
    //     plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
    //   },
    // },
  ],
  css: {
    transformer: "lightningcss",
    lightningcss: {
      cssModules: {
        pattern: "[local]",
      },
    },
  },
  build: {
    modulePreload: false,
    cssMinify: "lightningcss",
    // sourcemap: true,
    // rollupOptions: {
    //   output: {
    //     manualChunks: {
    //       vendor: [
    //         "react",
    //         "react-dom",
    //         "react-dom/client",
    //         "react/jsx-runtime",
    //         "react/compiler-runtime",
    //       ],
    //     },
    //   },
    // },
  },
});
