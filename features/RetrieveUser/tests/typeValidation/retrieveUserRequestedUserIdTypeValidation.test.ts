import {afterAll, describe, expect, test} from "@jest/globals";

import UserRetrievalOnPostgreSQLDatabase from "../../RetrieveUserMain/database/UserRetrievalOnPostgreSQLDatabase";
import RetrieveUserRequest from "../../RetrieveUserController/RetrieveUserRequest";
import RetrieveUserTypeValidator from "../../RetrieveUserMain/validation/RetrieveUserTypeValidator";

import TypeValidator from "../../../../services/validation/TypeValidator";

import BadRequestError from "../../../../services/errors/BadRequestError";

afterAll(async() => {
    const userRetrievalOnPostgreSQLDatabase: UserRetrievalOnPostgreSQLDatabase = await retrieveUserRetrievalOnPostgreSQLDatabase();
    await userRetrievalOnPostgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await userRetrievalOnPostgreSQLDatabase.close();
});

const retrieveUserRetrievalOnPostgreSQLDatabase = async (): Promise<UserRetrievalOnPostgreSQLDatabase> => {
    const userRetrievalOnPostgreSQLDatabase = new UserRetrievalOnPostgreSQLDatabase();
    await userRetrievalOnPostgreSQLDatabase.connect();

    return userRetrievalOnPostgreSQLDatabase;
}

describe("test user retrieval feature requested user id type validation", () => {
    test("Cannot update a user using an array as a requested user id", async () => {
        const retrieveUserTypeValidator = new RetrieveUserTypeValidator(new TypeValidator());
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest(retrieveUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = ["value"];

        const misformedRequest = () => {
            retrieveUserRequest.setRequestedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Requested user id needs to be of type \"string\", \"array\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("requested_user_id_type_is_not_string_but_array");
        }
    });

    test("Cannot update a user using an object as a requested user id", async () => {
        const retrieveUserTypeValidator = new RetrieveUserTypeValidator(new TypeValidator());
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest(retrieveUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = {};

        const misformedRequest = () => {
            retrieveUserRequest.setRequestedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Requested user id needs to be of type \"string\", \"object\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("requested_user_id_type_is_not_string_but_object");
        }
    });

    test("Cannot update a user using null as a requested user id", async () => {
        const retrieveUserTypeValidator = new RetrieveUserTypeValidator(new TypeValidator());
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest(retrieveUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = null;

        const misformedRequest = () => {
            retrieveUserRequest.setRequestedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Requested user id needs to be of type \"string\", \"null\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("requested_user_id_type_is_not_string_but_null");
        }
    });

    test("Cannot update a user using a boolean as a requested user id", async () => {
        const retrieveUserTypeValidator = new RetrieveUserTypeValidator(new TypeValidator());
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest(retrieveUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = true;

        const misformedRequest = () => {
            retrieveUserRequest.setRequestedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Requested user id needs to be of type \"string\", \"boolean\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("requested_user_id_type_is_not_string_but_boolean");
        }
    });

    test("Cannot update a user using undefined as a requested user id", async () => {
        const retrieveUserTypeValidator = new RetrieveUserTypeValidator(new TypeValidator());
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest(retrieveUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = undefined;

        const misformedRequest = () => {
            retrieveUserRequest.setRequestedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Requested user id needs to be of type \"string\", \"undefined\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("requested_user_id_type_is_not_string_but_undefined");
        }
    });

    test("Cannot update a user using a number as a requested user id", async () => {
        const retrieveUserTypeValidator = new RetrieveUserTypeValidator(new TypeValidator());
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest(retrieveUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = 1234;

        const misformedRequest = () => {
            retrieveUserRequest.setRequestedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Requested user id needs to be of type \"string\", \"number\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("requested_user_id_type_is_not_string_but_number");
        }
    });

    test("Cannot update a user using a function as a requested user id", async () => {
        const retrieveUserTypeValidator = new RetrieveUserTypeValidator(new TypeValidator());
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest(retrieveUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = function() {};

        const misformedRequest = () => {
            retrieveUserRequest.setRequestedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Requested user id needs to be of type \"string\", \"function\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("requested_user_id_type_is_not_string_but_function");
        }
    });

    test("Cannot update a user using a symbol as a requested user id", async () => {
        const retrieveUserTypeValidator = new RetrieveUserTypeValidator(new TypeValidator());
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest(retrieveUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = Symbol();

        const misformedRequest = () => {
            retrieveUserRequest.setRequestedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Requested user id needs to be of type \"string\", \"symbol\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("requested_user_id_type_is_not_string_but_symbol");
        }
    });
});