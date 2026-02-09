import express from "express";
import type { Request, Response, Router } from "express";
import bodyParser from "body-parser";
import type { NextHandleFunction } from "connect";

import UserPasswordUpdateOnPostgreSQLDatabase from "./database/UserPasswordUpdateOnPostgreSQLDatabase";
import UpdateUserPasswordInputJoiValidation from "./validation/UpdateUserPasswordInputJoiValidation";
import UpdateUserPasswordRequest from "../UpdateUserPasswordController/UpdateUserPasswordRequest";
import UpdateUserPasswordController from "../UpdateUserPasswordController/UpdateUserPasswordController";
import UpdateUserPasswordResponse from "../UpdateUserPasswordController/UpdateUserPasswordResponse";
import UpdateUserPasswordTypeValidator from "./validation/UpdateUserPasswordTypeValidator";
import TypeValidator from "../../../../services/validation/TypeValidator";

import AuthenticationMiddleware from "../../../../services/middleware/AuthenticationMiddleware";

import BadRequestError from "../../../../services/errors/BadRequestError";
import UnauthorisedActionError from "../../../../services/errors/UnauthorisedActionError";

const UpdateUserPasswordRouter: Router = express.Router();
const jsonParser: NextHandleFunction = bodyParser.json();

UpdateUserPasswordRouter.put("/password", jsonParser, AuthenticationMiddleware, async (request: Request, response: Response) => {
    const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = new UserPasswordUpdateOnPostgreSQLDatabase();

    try {
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();

        await userPasswordUpdateOnPostgreSQLDatabase.connect();

        const updateUserPasswordRequest: UpdateUserPasswordRequest = composeUpdateUserPasswordRequest(request.body, request.params.userId);

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();
        const updateUserPasswordResponse: UpdateUserPasswordResponse = await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);

        await userPasswordUpdateOnPostgreSQLDatabase.close();

        if (updateUserPasswordResponse.userPasswordWasUpdated()) {
            response.status(200).json("User password updated");
        } else {
            response.status(500).json("User password not updated");
        }
    } catch(error) {
        await userPasswordUpdateOnPostgreSQLDatabase.close();

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

const composeUpdateUserPasswordRequest = (requestBody: any, userId: string): UpdateUserPasswordRequest => {
    const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
    const updateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);

    updateUserPasswordRequest.setUserId(userId)
    .setUpdatedUserId(requestBody.updatedUserId)
    .setOrignalPassword(requestBody.originalPassword)
    .setChangedPassword(requestBody.changedPassword)
    .setChangedPasswordConfirmation(requestBody.changedPasswordConfirmation);

    return updateUserPasswordRequest;
}

export { UpdateUserPasswordRouter }