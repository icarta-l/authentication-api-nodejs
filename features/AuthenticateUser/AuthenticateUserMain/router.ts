import express from 'express';
import type { Request, Response, Router } from 'express';
import bodyParser from 'body-parser';
import type { NextHandleFunction } from "connect";
import BadRequestError from '../../../services/errors/BadRequestError';
import UnauthorisedActionError from '../../../services/errors/UnauthorisedActionError';
import UserAuthenticationOnPostgreSQLDatabase from './database/UserAuthenticationOnPostgreSQLDatabase';
import AuthenticateUserController from '../AuthenticateUserController/AuthenticateUserController';
import AuthenticateUserRequest from '../AuthenticateUserController/AuthenticateUserRequest';
import AuthenticateUserResponse from '../AuthenticateUserController/AuthenticateUserResponse';
import jwt from 'jsonwebtoken';
import "dotenv/config";
import JoiValidation from './validation/JoiValidation';

const AuthenticateUserRouter: Router = express.Router();
const jsonParser: NextHandleFunction = bodyParser.json();

const composeAuthenticateUserRequest = (requestBody: any): AuthenticateUserRequest => {
    const authenticateUserRequest = new AuthenticateUserRequest();

    authenticateUserRequest.setEmail(requestBody.email)
    .setPassword(requestBody.password);

    return authenticateUserRequest;
}


AuthenticateUserRouter.post("/", jsonParser, async (request: Request, response: Response) => {
    const joiValidation: JoiValidation = new JoiValidation();

    try {
        const userAuthenticationOnPostgreSQLDatabase: UserAuthenticationOnPostgreSQLDatabase = new UserAuthenticationOnPostgreSQLDatabase();

        const [, authenticateUserRequest] = await Promise.all([userAuthenticationOnPostgreSQLDatabase.connect(), composeAuthenticateUserRequest(request.body)]);

        const authenticateUserController: AuthenticateUserController = new AuthenticateUserController();
        const authenticateUserResponse: AuthenticateUserResponse = await authenticateUserController.handleAuthenticateUserRequest(authenticateUserRequest, userAuthenticationOnPostgreSQLDatabase, joiValidation);

        if (authenticateUserResponse.userIsLoggedIn()) {
            if (!process.env.JSONWEBTOKEN_SECRET_KEY) {
                throw new Error("FATAL ERROR: json web token secret key not defined!");
            }

            response.status(200)
            .json({
                message: "User logged in",
                token: jwt.sign({userID: authenticateUserResponse.getUserId()}, process.env.JSONWEBTOKEN_SECRET_KEY, {
                    "expiresIn": "1h"
                })
            });
        } else {
            response.status(500)
            .json("Couldn't log in");
        }
        
    } catch(error) {
        if (error instanceof BadRequestError) {
            response.status(422)
            .json(error.getMessage());
        } else if(error instanceof UnauthorisedActionError) {
            response.status(403)
            .json(error.getMessage());
        } else {
            throw error;
        }
    }
});

export { AuthenticateUserRouter }