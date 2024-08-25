import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../environment";

export function encryptToken(payload: any): any {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

export function decryptToken(token: string): any {
    return jwt.decode(token);
}
