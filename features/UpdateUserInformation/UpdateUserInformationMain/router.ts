import express from "express";
import type { Request, Response, Router } from "express";
import bodyParser from "body-parser";
import type { NextHandleFunction } from "connect";

import UserInformationUpdateOnPostgreSQLDatabase from "./database/UserInformationUpdateOnPostgreSQLDatabase";
import UpdateUserInformationInputJoiValidation from "./validation/UpdateUserInformationInputJoiValidation";
import UpdateUserInformationRequest from "../UpdateUserInformationController/UpdateUserInformationRequest";
import UpdateUserInformationController from "../UpdateUserInformationController/UpdateUserInformationController";
import UpdateUserInformationResponse from "../UpdateUserInformationController/UpdateUserInformationResponse";

import AuthenticationMiddleware from "../../../services/middleware/AuthenticationMiddleware";

import BadRequestError from "../../../services/errors/BadRequestError";
import UnauthorisedActionError from "../../../services/errors/UnauthorisedActionError";

const UpdateUserInformationRouter: Router = express.Router();
const jsonParser: NextHandleFunction = bodyParser.json();

UpdateUserInformationRouter.put("/", jsonParser, AuthenticationMiddleware, async (request: Request, response: Response) => {
    const userInformationUpdateOnPostgreSQLDatabase: UserInformationUpdateOnPostgreSQLDatabase = new UserInformationUpdateOnPostgreSQLDatabase();

    try {
        const updateUserInformationInputJoiValidation: UpdateUserInformationInputJoiValidation = new UpdateUserInformationInputJoiValidation();

        await userInformationUpdateOnPostgreSQLDatabase.connect();

        const updateUserInformationRequest = composeUpdateUserInformationRequest(request.body, request.params.userId);

        const updateUserInformationController: UpdateUserInformationController = new UpdateUserInformationController();
        const updateUserInformationResponse: UpdateUserInformationResponse = await updateUserInformationController.handleUpdateUserInformationRequest(updateUserInformationRequest, userInformationUpdateOnPostgreSQLDatabase, updateUserInformationInputJoiValidation);

        await userInformationUpdateOnPostgreSQLDatabase.close();

        if (updateUserInformationResponse.userInformationWereUpdated()) {
            response.status(200).json("User information updated");
        } else {
            response.status(500).json("User information not updated");
        }
    } catch(error) {
        await userInformationUpdateOnPostgreSQLDatabase.close();

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

const composeUpdateUserInformationRequest = (requestBody: any, userId: string): UpdateUserInformationRequest => {
    const updateUserInformationRequest = new UpdateUserInformationRequest();
    updateUserInformationRequest.setUserId(userId)
    .setUpdatedUserId(requestBody.updatedUserId)
    .setFirstName(requestBody.firstName)
    .setLastName(requestBody.lastName);

    return updateUserInformationRequest;
}

export { UpdateUserInformationRouter }