import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";

import config from "config";
import router from "./routes";
import { errorHandler, notFoundMiddleware } from "middleware/error";
import { initDatabase } from "./database";
import "auth/passport";

// Init express
const app = express();
const server = http.createServer(app);

// Add middlewares
app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use("/api/v1/", router);

// Catch 404 and forward to error handler
app.use(notFoundMiddleware);

// Add error handler
app.use(errorHandler);

(async () => {
  await initDatabase(config.MAX_RETRIES);
  server.listen(config.PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server started at http://localhost:${config.PORT}`);
  });

  server.on("error", () => {});
})();
