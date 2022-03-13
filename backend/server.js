const express = require("express");
// const proxy = require("express-http-proxy");
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.get("/proxy", (req, res) => {
  res.send("Hello !");
});

// app.get("/", (req, res) => {
//   res.send("Hello World!!");
// });

// app.all("*", proxy("localhost:3001", {
//   // preserveHostHdr: true
// }));

app.all('*', createProxyMiddleware({
  target: 'http://localhost:3001',
  ws: true,
}));

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
