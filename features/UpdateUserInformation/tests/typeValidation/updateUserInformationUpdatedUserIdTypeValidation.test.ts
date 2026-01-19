import {afterAll, describe, expect, test} from "@jest/globals";

import UserInformationUpdateOnPostgreSQLDatabase from "../../UpdateUserInformationMain/database/UserInformationUpdateOnPostgreSQLDatabase";
import UpdateUserInformationRequest from "../../UpdateUserInformationController/UpdateUserInformationRequest";
import UpdateUserInformationTypeValidator from "../../UpdateUserInformationMain/validation/UpdateUserInformationTypeValidator";

import TypeValidator from "../../../../services/validation/TypeValidator";

import BadRequestError from "../../../../services/errors/BadRequestError";

afterAll(async() => {
    const userInformationUpdateOnPostgreSQLDatabase: UserInformationUpdateOnPostgreSQLDatabase = await retrieveUserInformationUpdateOnPostgreSQLDatabase();
    await userInformationUpdateOnPostgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await userInformationUpdateOnPostgreSQLDatabase.close();
});

const retrieveUserInformationUpdateOnPostgreSQLDatabase = async (): Promise<UserInformationUpdateOnPostgreSQLDatabase> => {
    const userInformationUpdateOnPostgreSQLDatabase = new UserInformationUpdateOnPostgreSQLDatabase();
    await userInformationUpdateOnPostgreSQLDatabase.connect();

    return userInformationUpdateOnPostgreSQLDatabase;
}

describe("test user information update feature updated user id type validation", () => {
    test("Cannot update a user using an array as an updated user id", async () => {
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);

        const arrayInsteadOfStringInput: unknown = ["value"];

        const misformedRequest = () => {
            updateUserInformationRequest.setUpdatedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Updated user id needs to be of type \"string\", \"array\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_type_is_not_string_but_array");
        }
    });

    test("Cannot update a user using an object as an updated user id", async () => {
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);

        const arrayInsteadOfStringInput: unknown = {};

        const misformedRequest = () => {
            updateUserInformationRequest.setUpdatedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Updated user id needs to be of type \"string\", \"object\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_type_is_not_string_but_object");
        }
    });

    test("Cannot update a user using null as an updated user id", async () => {
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);

        const arrayInsteadOfStringInput: unknown = null;

        const misformedRequest = () => {
            updateUserInformationRequest.setUpdatedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Updated user id needs to be of type \"string\", \"null\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_type_is_not_string_but_null");
        }
    });

    test("Cannot update a user using a boolean as an updated user id", async () => {
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);

        const arrayInsteadOfStringInput: unknown = true;

        const misformedRequest = () => {
            updateUserInformationRequest.setUpdatedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Updated user id needs to be of type \"string\", \"boolean\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_type_is_not_string_but_boolean");
        }
    });

    test("Cannot update a user using undefined as an updated user id", async () => {
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);

        const arrayInsteadOfStringInput: unknown = undefined;

        const misformedRequest = () => {
            updateUserInformationRequest.setUpdatedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Updated user id needs to be of type \"string\", \"undefined\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_type_is_not_string_but_undefined");
        }
    });

    test("Cannot update a user using a number as an updated user id", async () => {
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);

        const arrayInsteadOfStringInput: unknown = 1234;

        const misformedRequest = () => {
            updateUserInformationRequest.setUpdatedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Updated user id needs to be of type \"string\", \"number\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_type_is_not_string_but_number");
        }
    });

    test("Cannot update a user using a function as an updated user id", async () => {
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);

        const arrayInsteadOfStringInput: unknown = function() {};

        const misformedRequest = () => {
            updateUserInformationRequest.setUpdatedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Updated user id needs to be of type \"string\", \"function\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_type_is_not_string_but_function");
        }
    });

    test("Cannot update a user using a symbol as an updated user id", async () => {
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);

        const arrayInsteadOfStringInput: unknown = Symbol();

        const misformedRequest = () => {
            updateUserInformationRequest.setUpdatedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Updated user id needs to be of type \"string\", \"symbol\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_type_is_not_string_but_symbol");
        }
    });
});