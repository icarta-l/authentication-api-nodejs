import express from "express";
import type { Request, Response, Router } from "express";
import bodyParser from "body-parser";
import type { NextHandleFunction } from "connect";
import UserRetrievalOnPostgreSQLDatabase from "./database/UserRetrievalOnPostgreSQLDatabase";
import RetrieveUserController from "../RetrieveUserController/RetrieveUserController";
import RetrieveUserRequest from "../RetrieveUserController/RetrieveUserRequest";
import type RetrieveUserResponse from "../RetrieveUserController/RetrieveUserResponse";
import BadRequestError from "../../../services/errors/BadRequestError";
import UnauthorisedActionError from "../../../services/errors/UnauthorisedActionError";
import RetrieveUserInputJoiValidation from "./validation/RetrieveUserInputJoiValidation";
import RetrieveUserOutputJoiValidation from "./validation/RetrieveUserOutputJoiValidation";

const RetrieveUserRouter: Router = express.Router();
const jsonParser: NextHandleFunction = bodyParser.json();

RetrieveUserRouter.get("/", jsonParser, async (request: Request, response: Response) => {
    const userRetrievalOnPostgreSQLDatabase: UserRetrievalOnPostgreSQLDatabase = new UserRetrievalOnPostgreSQLDatabase();

    try {
        const retrieveUserInputJoiValidation: RetrieveUserInputJoiValidation = new RetrieveUserInputJoiValidation();
        const retrieveUserOutputJoiValidation: RetrieveUserOutputJoiValidation = new RetrieveUserOutputJoiValidation();

        await userRetrievalOnPostgreSQLDatabase.connect();

        const registerUserRequest = composeRetrieveUserRequest(request.body);

        const retrieveUserController: RetrieveUserController = new RetrieveUserController();
        const retrieveUserResponse: RetrieveUserResponse = await retrieveUserController.handleRetrieveUserRequest(registerUserRequest, userRetrievalOnPostgreSQLDatabase, retrieveUserInputJoiValidation, retrieveUserOutputJoiValidation);
        await userRetrievalOnPostgreSQLDatabase.close();

        response.status(200).json({
            username: retrieveUserResponse.getUsername(),
            email: retrieveUserResponse.getEmail(),
            firstName: retrieveUserResponse.getFirstName(),
            lastName: retrieveUserResponse.getLastName()
        });
    } catch(error) {
        await userRetrievalOnPostgreSQLDatabase.close();

        if (error instanceof BadRequestError) {
            response.status(422)
            .json(error.getMessage());
        } else if(error instanceof UnauthorisedActionError) {
            response.status(403)
            .json(error.getMessage());
        } else if (error instanceof Error) {
            response.status(500)
            .json(error.message);
        }
    }
});

const composeRetrieveUserRequest = (requestBody: any): RetrieveUserRequest => {
    const retrieveUserRequest = new RetrieveUserRequest();
    retrieveUserRequest.setRequestedUserId(requestBody.userId);

    return retrieveUserRequest;
}

export { RetrieveUserRouter }