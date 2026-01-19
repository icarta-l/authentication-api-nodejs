import express from 'express';
import type { Request, Response, Router } from 'express';
import bodyParser from 'body-parser';
import type { NextHandleFunction } from "connect";

import UserRegistrationOnPostgreSQLDatabase from "./database/UserRegistrationOnPostgreSQLDatabase";
import RegisterUserController from '../RegisterUserController/RegisterUserController';
import RegisterUserRequest from '../RegisterUserController/RegisterUserRequest';
import type RegisterUserResponse from '../RegisterUserController/RegisterUserResponse';
import RegisterUserTypeValidator from './validation/RegisterUserTypeValidator';

import BadRequestError from '../../../services/errors/BadRequestError';
import UnauthorisedActionError from '../../../services/errors/UnauthorisedActionError';
import RegisterUserJoiValidation from './validation/RegisterUserJoiValidation';
import TypeValidator from '../../../services/validation/TypeValidator';

const RegisterUserRouter: Router = express.Router();
const jsonParser: NextHandleFunction = bodyParser.json();

RegisterUserRouter.post("/", jsonParser, async (request: Request, response: Response) => {
    const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = new UserRegistrationOnPostgreSQLDatabase();

    try {
        const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();
        await userRegistrationOnPostgreSQLDatabase.connect();
        const registerUserRequest = composeRegisterUserRequest(request.body);

        const registerUserController: RegisterUserController = new RegisterUserController();
        const registerUserResponse: RegisterUserResponse = await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);

        await userRegistrationOnPostgreSQLDatabase.close();

        if (registerUserResponse.userIsRegistered()) {
            response.status(201)
            .json("User Registered!");
        } else {
            response.status(409)
            .json("User couldn't be registered");
        }
        
    } catch(error) {
        await userRegistrationOnPostgreSQLDatabase.close();

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

const composeRegisterUserRequest = (requestBody: any): RegisterUserRequest => {
    const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
    const registerUserRequest = new RegisterUserRequest(registerUserTypeValidator);

    registerUserRequest.setEmail(requestBody.email)
    .setUsername(requestBody.username)
    .setPassword(requestBody.password);

    if (typeof requestBody.firstName !== "undefined" && requestBody.firstName !== null) {
        registerUserRequest.setFirstName(requestBody.firstName)
        .setLastName(requestBody.lastName);
    }

    return registerUserRequest;
}

export { RegisterUserRouter }