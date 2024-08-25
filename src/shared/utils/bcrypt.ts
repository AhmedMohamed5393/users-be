import * as bcryptjs from "bcryptjs";
import { PASS_SALT } from "../../environment";

export async function encryptPassword(password: string) {
    return bcryptjs.hashSync(password, PASS_SALT);
}

export async function comparePassword(
    requestPassword: string,
    userPassword: string,
) {
    return bcryptjs.compareSync(requestPassword, userPassword);
}
