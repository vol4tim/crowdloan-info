import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import createServer from "./server";
import db from "./models/db";
import statistic from "./modules/statistic/route";
import email from "./modules/email/route";
import config from "./consts";
import logger from "./services/logger";
// import parse from "./parse";
import "./models/contributes";

const app = express();
const server = createServer(app);
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// app.use("/", express.static("public"));
app.use("/api/statistic", statistic);
app.use("/api/email", email);

db.sequelize.sync().then(() => {
  server.listen(config.PORT, config.HOST, () => {
    logger.info("Web listening " + config.HOST + " on port " + config.PORT);
    // parse();
  });
});
