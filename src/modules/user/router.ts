import express from "express";
import index from ".";
import { getRoutes } from "../../shared/utils/helpers";

const part_url = "/api/user";
const router = express.Router();
const config = index.getConfig();
const service = index.createModule();

export default getRoutes(
    part_url,
    router,
    config,
    service,
);
