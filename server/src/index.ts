import { Server } from "@colyseus/core";
import { monitor } from "@colyseus/monitor";
import { WebSocketTransport } from "@colyseus/ws-transport";
import dotenv from "dotenv";
import express from "express";
import expressBasicAuth from "express-basic-auth";
import http from "http";
import serveStatic from "serve-static";

import { prisma } from "./db.js";
import { Poll } from "./rooms/Poll.js";
import { deleteExpired } from "./rooms/helpers/persistence.js";

dotenv.config({
  path: "../.env.local",
});
dotenv.config({
  path: "../.env",
});

const port = Number(process.env.EXPRESS_PORT);
const app = express();

const server = http.createServer(app);
const gameServer = new Server({
  transport: new WebSocketTransport({
    server,
  }),
});

// register room handlers
gameServer.define("poll", Poll);
const roomCleanup = setInterval(deleteExpired, 1000 * 60 * 5); // every 5 min

// close db connection on shutdown
gameServer.onShutdown(async () => {
  clearInterval(roomCleanup);
  await prisma.$disconnect();
});

// register colyseus monitor
app.use(
  "/colyseus",
  expressBasicAuth({
    users: { admin: process.env.MONITOR_PASSWORD! },
    challenge: true,
    realm: "Colyseus monitor for Poll",
  }),
  monitor(),
);

if (process.env.NODE_ENV === "production") {
  // in production mode, the express server serves the vue dist directory
  const staticPath = process.env.VUE_DIST_DIR!;
  app.use(serveStatic(staticPath));
  app.get("*", (req: express.Request, res: express.Response) => {
    res.sendFile("index.html", { root: staticPath });
  });
}

gameServer.listen(port);
// eslint-disable-next-line no-console
console.log(`Listening on localhost:${port}`);
