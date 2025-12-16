import type { NextFunction } from "connect";
import type { Request, Response } from "express";
import jwt, {JwtPayload} from 'jsonwebtoken';
import "dotenv/config";

import UnauthorisedActionError from "../errors/UnauthorisedActionError";

interface UserPayload extends JwtPayload {
  userID: string;
}

async function AuthenticationMiddleware (request: Request, response: Response, next: NextFunction) {
    const authorizationHeader = request.get("Authorization");
    
    if (authorizationHeader === undefined) {
        response.status(403).json({
            message: "User is not authenticated",
            code: "user_not_authenticated"
        });
    } else {
        const token = authorizationHeader.split(" ")[1];

        if (!process.env.JSONWEBTOKEN_SECRET_KEY) {
            throw new Error("FATAL ERROR: json web token secret key not defined!");
        }

        try {
            const decoded = jwt.verify(token, process.env.JSONWEBTOKEN_SECRET_KEY) as UserPayload;

            if (decoded.userID === undefined) {
                throw new Error("FATAL ERROR: couldn't retrieve the authenticated user");
            }
            
            request.params.userId = decoded.userID;
        } catch(error) {
            throw new Error("FATAL ERROR: couldn't read authorization token");
        }

        next();
    }

}

export default AuthenticationMiddleware;