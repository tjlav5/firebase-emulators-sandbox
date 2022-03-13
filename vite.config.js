import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  build: {
    outDir: "build",
  },
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      port: 443, // Run the websocket server on the SSL port
    },
    proxy: {
      "/api/config": {
        target: "http://localhost:4002",
        // rewrite: (path) => path.replace(/^\/emulators\/ui/, ""),
        selfHandleResponse: true,
        configure: (proxy, options) => {
          // proxy will be an instance of 'http-proxy'
          proxy.on("proxyRes", function (proxyRes, req, res) {
            var body = [];
            proxyRes.on("data", function (chunk) {
              body.push(chunk);
            });
            proxyRes.on("end", function () {
              body = Buffer.concat(body).toString();
              const config = JSON.parse(body);
              config.firestore.host = 'clever-obtainable-snowflake.glitch.me';
              config.firestore.port = '80/emulators/firestore';
              config.logging.host = 'clever-obtainable-snowflake.glitch.me';
              config.logging.port = '80/emulators/logging';
              res.end(JSON.stringify(config));
            });
          });
        },
      },
      "/emulators/ui": {
        target: "http://localhost:4002",
        rewrite: (path) => path.replace(/^\/emulators\/ui/, ""),
        selfHandleResponse: true,
        configure: (proxy, options) => {
          // proxy will be an instance of 'http-proxy'
          proxy.on("proxyRes", function (proxyRes, req, res) {
            var body = [];
            proxyRes.on("data", function (chunk) {
              body.push(chunk);
            });
            proxyRes.on("end", function () {
              body = Buffer.concat(body).toString();
              // console.log("res from proxied server:", body);
              // res.end("my response to cli");
              res.end(
                body
                  .replace("manifest.json", "emulators/ui/manifest.json")
                  .replace(/\/static/g, "/emulators/ui/static")
              );
            });
          });
        },
      },
      "/emulators/functions": {
        target: "http://127.0.0.1:4003",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/emulators\/functions/, ""),
      },
      "/emulators/firestore": {
        target: "http://127.0.0.1:4001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/emulators\/firestore/, ""),
      },
      "/emulators/logging": {
        target: "http://127.0.0.1:4004",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/emulators\/logging/, ""),
        ws: true,
      },
    },
  },
});
