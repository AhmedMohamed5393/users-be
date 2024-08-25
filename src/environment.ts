import * as dotenv from "dotenv";
import * as nodepath from "path";

dotenv.config();

const basedir = nodepath.dirname(require.main.filename);

let path: string;
switch (process.env.NODE_ENV) {
  case "test":
    path = `${basedir}/../.env.test`;
    break;
  case "production":
    path = `${basedir}/../.env.production`;
    break;
  default:
    path = `${basedir}/../.env.development`;
}

dotenv.config({ path });

export const HOST = process.env.HOST;
export const PORT = process.env.PORT;
export const BASE_URL = process.env.BASE_URL;
export const SECRET_KEY = process.env.SECRET_KEY;
export const PASS_SALT = +process.env.PASS_SALT;

export const DB_NAME = process.env.DB_NAME;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = +process.env.DB_PORT;
export const DB_USERNAME = process.env.DB_ADMIN_USERNAME;
export const DB_PASSWORD = process.env.DB_ADMIN_PASSWORD;
export const DB_SYNC = process.env.DB_SYNC == "true";
export const DB_LOGGING = process.env.DB_LOGGING == "true";
