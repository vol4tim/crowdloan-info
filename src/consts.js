import path from "path";
import config from "../config.json";

export default {
  DEBUG: process.env.DEBUG
    ? process.env.DEBUG.trim().toLowerCase() === "true"
    : false,
  HOST: process.env.HOST || config.server.host,
  PORT: process.env.PORT || config.server.port,
  SSL_ENABLE: process.env.SSL_ENABLE
    ? process.env.SSL_ENABLE.trim().toLowerCase() === "true"
    : false,
  SSL: {
    key: process.env.SSL_KEY || "",
    cer: process.env.SSL_CER || "",
  },
  PATH_DB: path.join(__dirname, "/../files/database.sqlite"),
  ...config,
};
