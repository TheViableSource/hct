// Production server entry point for Plesk (Phusion Passenger) and any
// Node host that launches a single startup file.
//
// Passenger intercepts the .listen() call and supplies the port/socket,
// so listening on process.env.PORT (or 3000 as a fallback) is correct here.
//
// Requires a production build first:  npm run build
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

// Default to production unless explicitly told otherwise. Plesk's
// "Application Mode: production" sets NODE_ENV=production for you.
const dev = process.env.NODE_ENV === "development";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(port, () => {
      console.log(
        `> HCT ready on port ${port} (${dev ? "development" : "production"})`
      );
    });
  })
  .catch((err) => {
    console.error("Failed to start Next.js server:", err);
    process.exit(1);
  });
