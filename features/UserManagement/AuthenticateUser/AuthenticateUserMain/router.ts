import express from 'express';
import type { Request, Response, Router } from 'express';
import bodyParser from 'body-parser';
import type { NextHandleFunction } from "connect";

import BadRequestError from '../../../../services/errors/BadRequestError';
import UnauthorisedActionError from '../../../../services/errors/UnauthorisedActionError';
import TypeValidator from '../../../../services/validation/TypeValidator';

import UserAuthenticationOnPostgreSQLDatabase from './database/UserAuthenticationOnPostgreSQLDatabase';
import AuthenticateUserController from '../AuthenticateUserController/AuthenticateUserController';
import AuthenticateUserRequest from '../AuthenticateUserController/AuthenticateUserRequest';
import AuthenticateUserResponse from '../AuthenticateUserController/AuthenticateUserResponse';
import AuthenticateUserJoiValidation from './validation/AuthenticateUserJoiValidation';
import AuthenticateUserTypeValidator from './validation/AuthenticateUserTypeValidator';

import jwt from 'jsonwebtoken';
import "dotenv/config";

const AuthenticateUserRouter: Router = express.Router();
const jsonParser: NextHandleFunction = bodyParser.json();

const composeAuthenticateUserRequest = async (requestBody: any): Promise<AuthenticateUserRequest> => {
    const authenticateUserTypeValidator = new AuthenticateUserTypeValidator(new TypeValidator());
    const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest(authenticateUserTypeValidator);

    authenticateUserRequest.setEmail(requestBody.email)
    .setPassword(requestBody.password);

    return authenticateUserRequest;
}


AuthenticateUserRouter.post("/", jsonParser, async (request: Request, response: Response) => {
    const authenticateUserJoiValidation: AuthenticateUserJoiValidation = new AuthenticateUserJoiValidation();
    const userAuthenticationOnPostgreSQLDatabase: UserAuthenticationOnPostgreSQLDatabase = new UserAuthenticationOnPostgreSQLDatabase();

    try {
        await userAuthenticationOnPostgreSQLDatabase.connect();
        const authenticateUserRequest = await composeAuthenticateUserRequest(request.body);
        const authenticateUserController: AuthenticateUserController = new AuthenticateUserController();
        const authenticateUserResponse: AuthenticateUserResponse = await authenticateUserController.handleAuthenticateUserRequest(authenticateUserRequest, userAuthenticationOnPostgreSQLDatabase, authenticateUserJoiValidation);
        
        await userAuthenticationOnPostgreSQLDatabase.close();

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
            response.status(401)
            .json("Couldn't log in");
        }
        
    } catch(error) {
        await userAuthenticationOnPostgreSQLDatabase.close();

        if (error instanceof BadRequestError) {
            response.status(422)
            .json({
                message: error.getMessage(),
                code: error.getErrorCode()
            });
        } else if (error instanceof UnauthorisedActionError) {
            response.status(403)
            .json({
                message: error.getMessage(),
                code: error.getErrorCode()
            });
        } else if (error instanceof Error) {
            response.status(500)
            .json(error.message);
        }
    }
});

export { AuthenticateUserRouter }