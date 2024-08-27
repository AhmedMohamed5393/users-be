import Debug from "debug";
import express from "express";
import * as env from "./environment";
import user from "./modules/user/router";
// import { Database } from "./database/database";
// import { User } from "./modules/user/models/entities/user.entity";
// import { encryptPassword } from "./shared/utils/bcrypt";
// import { RoleEnum } from "./shared/enums/role.enum";

const debug = Debug("users-be");
const app = express();
const port = env.PORT || 3000;
const host = env.HOST;

// use modules routes
app.use(user);

app.get("/", async (req, res) => {
    // const repository = await new Database().getRepository(User);

    // const user = new User();
    // user.name = "Admin";
    // user.email = "admin123@gmail.com";
    // user.password = "12345678";
    // user.role = RoleEnum.admin;

    // await repository.save(user);
    res.send("App is up and running!");
});

app.use(notFoundHandler);
app.set("port", port);

app.listen(+port, host, () => {
    try {
        console.log(`The server is connected to http://${host}:${port}`);
    } catch (error) {
        throw error;
    }
});

module.exports = app;

function notFoundHandler(req, res) {
    debug(req.protocol + "://" + req.get("host") + req.originalUrl);

    return res.status(404).json({ error: "Not Found" });
}
