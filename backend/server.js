const express = require("express");
// const proxy = require("express-http-proxy");
const {
  createProxyMiddleware,
  responseInterceptor,
} = require("http-proxy-middleware");
// import fetch from 'node-fetch';
const fetch = require("node-fetch");

const app = express();

let firestoreWebSocketPort = "80";

app.get("/proxy", (req, res) => {
  res.send("Hello !");
});

// app.get("/", (req, res) => {
//   res.send("Hello World!!");
// });

// app.all("*", proxy("localhost:3001", {
//   // preserveHostHdr: true
// }));

app.all(
  "/foo/hub",
  createProxyMiddleware({
    target: "http://localhost:4002",
    changeOrigin: true,
    pathRewrite: { "^/foo/hub": "" },
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(
      async (responseBuffer, proxyRes, req, res) => {
        const response = responseBuffer.toString("utf8"); // convert buffer to string
        // console.log({ response });
        return response.replace(/\/static/g, "/foo/hub/static");
      }
    ),
  })
);

app.all(
  "/foo/hub/*",
  createProxyMiddleware({
    target: "http://localhost:4002",
    changeOrigin: true,
    pathRewrite: { "^/foo/hub": "" },
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(
      async (responseBuffer, proxyRes, req, res) => {
        const response = responseBuffer.toString("utf8"); // convert buffer to string
        // console.log({ response });
        return response.replace(/\/static/g, "/foo/hub/static");
      }
    ),
  })
);

app.all(
  "/api/config",
  createProxyMiddleware({
    target: "http://localhost:4002",
    changeOrigin: true,
    // pathRewrite: { "^/api": "" },
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(
      async (responseBuffer, proxyRes, req, res) => {
        const response = responseBuffer.toString("utf8"); // convert buffer to string
        if (!response) return response;

        const config = JSON.parse(response);
        // config.firestore.host = `${process.env.PROJECT_DOMAIN}.glitch.me`;
        // config.firestore.port = `80/proxy/firestore`;
        // firestoreWebSocketPort = config.firestore.webSocketPort;
        // config.firestore.webSocketHost = `${process.env.PROJECT_DOMAIN}.glitch.me`;
        // config.firestore.webSocketPort = `80/proxy/firestore-ws`;
        
        config.logging.ogPort = config.logging.port;
        config.logging.host = `${process.env.PROJECT_DOMAIN}.glitch.me`;
        config.logging.port = `80/proxy/logging`;

        return JSON.stringify(config);
        // console.log({ response });
        // return response.replace(/127.0.0.1/g, `${process.env.PROJECT_DOMAIN}.glitch.me`).replace(
        //   "4001",
        //   `"${process.env.PORT.replace(" ", "")}/proxy/firestore"`
        // );
        // return response.replace(/\/static/g, "/foo/hub/static");
      }
    ),
  })
);

app.all(
  "/proxy/functions/*",
  createProxyMiddleware({
    target: "http://127.0.0.1:4003",
    changeOrigin: true,
    pathRewrite: { "^/proxy/functions": "" },
  })
);

app.all(
  "/proxy/firestore/*",
  createProxyMiddleware({
    target: "http://localhost:4001",
    changeOrigin: true,
    pathRewrite: { "^/proxy/firestore": "" },
  })
);

app.all(
  "/proxy/logging",
  createProxyMiddleware({
    target: "http://localhost:4500",
    changeOrigin: true,
    pathRewrite: { "^/proxy/firestore": "" },
    ws: true,
  })
);

// fetch("http://localhost:4001/ws/discovery")
//   .then((r) => r.json())
//   .then(({ url }) => {
//     console.log({ url });
//     const port = url.split(":")[1];

//     app.all(
//       "/proxy/firestore-ws/*",
//       createProxyMiddleware({
//         target: `http://localhost:${port}`,
//         changeOrigin: true,
//         pathRewrite: { "^/proxy/firestore-ws": "" },
//         ws: true,
//       })
//     );

    app.all(
      "*",
      createProxyMiddleware({
        target: "http://localhost:3001",
        ws: true,
      })
    );

    app.listen(process.env.PORT, () => {
      console.log(`Example app listening on port ${process.env.PORT}`);
    });
  // });
