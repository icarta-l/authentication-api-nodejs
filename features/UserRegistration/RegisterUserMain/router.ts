import express from 'express';
import type { Request, Response, Router } from 'express';
import bodyParser from 'body-parser';
import type { NextHandleFunction } from "connect";
import UserRegistrationOnPostgreSQLDatabase from "./database/UserRegistrationOnPostgreSQLDatabase";
import RegisterUserController from '../RegisterUserController/RegisterUserController';
import RegisterUserRequest from '../RegisterUserController/RegisterUserRequest';
import type RegisterUserResponse from '../RegisterUserController/RegisterUserResponse';
import BadRequestError from '../../../services/errors/BadRequestError';
import UnauthorisedActionError from '../../../services/errors/UnauthorisedActionError';
import JoiValidation from './validation/JoiValidation';

const UserRegistrationRouter: Router = express.Router();
const jsonParser: NextHandleFunction = bodyParser.json();

UserRegistrationRouter.post("/", jsonParser, async (request: Request, response: Response) => {
    try {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = new UserRegistrationOnPostgreSQLDatabase();
        const joiValidation: JoiValidation = new JoiValidation();

        const [, registerUserRequest] = await Promise.all([userRegistrationOnPostgreSQLDatabase.connect(), composeRegisterUserRequest(request.body)]);

        const registerUserController: RegisterUserController = new RegisterUserController();
        const registerUserResponse: RegisterUserResponse = await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, joiValidation);

        await userRegistrationOnPostgreSQLDatabase.close();

        if (registerUserResponse.userIsRegistered()) {
            response.status(201)
            .json("User Registered!");
        } else {
            response.status(409)
            .json("User couldn't be registered");
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

const composeRegisterUserRequest = (requestBody: any): RegisterUserRequest => {
    const registerUserRequest = new RegisterUserRequest();

    registerUserRequest.setEmail(requestBody.email)
    .setUsername(requestBody.username)
    .setPassword(requestBody.password);

    if (requestBody.firstName !== undefined) {
        registerUserRequest.setFirstName(requestBody.firstName)
        .setLastName(requestBody.lastName);
    }

    return registerUserRequest;
}

export { UserRegistrationRouter }