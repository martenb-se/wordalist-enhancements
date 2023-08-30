import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import monkey from "vite-plugin-monkey";
import packageJson from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  // Don't convert utf8 characters
  // https://github.com/lisonge/vite-plugin-monkey/issues/10#issuecomment-1207264978
  esbuild: {
    charset: "utf8"
  },
  plugins: [
    preact({
      devToolsEnabled: false,
      devtoolsInProd: false
    }),
    monkey({
      entry: "src/main.tsx",
      userscript: {
        "name": {
          "": packageJson.title,
          "sv-SE": packageJson["title:sv-SE"]
        },
        "author": packageJson.author,
        "namespace": packageJson.author,
        "description": {
          "": packageJson.description,
          "sv-SE": packageJson["description:sv-SE"]
        },
        "license": packageJson.license,
        "match": [
          // all of wordalist.com
          "https://wordalist.com/*"
          // TODO: be more restrictive
        ],
        "icon": "https://wordalist.com/favicon.ico",
        "run-at": "document-end"
      },
      build: {
        fileName: "wordalist.user.js"
        /*externalGlobals: {
          preact: cdn.jsdelivr('preact', 'dist/preact.min.js'),
        },*/
      },
      server: {
        // Open server when running
        open: true
      }
    })
  ],
  build: {
    cssMinify: false
  }
});
