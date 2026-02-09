import {afterAll, describe, expect, test} from "@jest/globals";

import UserPasswordUpdateOnPostgreSQLDatabase from "../../UpdateUserPasswordMain/database/UserPasswordUpdateOnPostgreSQLDatabase";
import UpdateUserPasswordRequest from "../../UpdateUserPasswordController/UpdateUserPasswordRequest";
import UpdateUserPasswordTypeValidator from "../../UpdateUserPasswordMain/validation/UpdateUserPasswordTypeValidator";

import TypeValidator from "../../../../../services/validation/TypeValidator";

import BadRequestError from "../../../../../services/errors/BadRequestError";

afterAll(async() => {
    const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
    await userPasswordUpdateOnPostgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await userPasswordUpdateOnPostgreSQLDatabase.close();
});

const retrieveUserPasswordUpdateOnPostgreSQLDatabase = async (): Promise<UserPasswordUpdateOnPostgreSQLDatabase> => {
    const userPasswordUpdateOnPostgreSQLDatabase = new UserPasswordUpdateOnPostgreSQLDatabase();
    await userPasswordUpdateOnPostgreSQLDatabase.connect();

    return userPasswordUpdateOnPostgreSQLDatabase;
}

describe("test user password update feature updated user id type validation", () => {
    test("Cannot update a user's password using an array as an updated user id", async () => {
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);

        const arrayInsteadOfStringInput: unknown = ["value"];

        const misformedRequest = () => {
            updateUserPasswordRequest.setUpdatedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Updated user id needs to be of type \"string\", \"array\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_type_is_not_string_but_array");
        }
    });

    test("Cannot update a user's password using an object as an updated user id", async () => {
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);

        const arrayInsteadOfStringInput: unknown = {};

        const misformedRequest = () => {
            updateUserPasswordRequest.setUpdatedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Updated user id needs to be of type \"string\", \"object\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_type_is_not_string_but_object");
        }
    });

    test("Cannot update a user's password using null as an updated user id", async () => {
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);

        const arrayInsteadOfStringInput: unknown = null;

        const misformedRequest = () => {
            updateUserPasswordRequest.setUpdatedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Updated user id needs to be of type \"string\", \"null\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_type_is_not_string_but_null");
        }
    });

    test("Cannot update a user's password using a boolean as an updated user id", async () => {
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);

        const arrayInsteadOfStringInput: unknown = true;

        const misformedRequest = () => {
            updateUserPasswordRequest.setUpdatedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Updated user id needs to be of type \"string\", \"boolean\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_type_is_not_string_but_boolean");
        }
    });

    test("Cannot update a user's password using undefined as an updated user id", async () => {
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);

        const arrayInsteadOfStringInput: unknown = undefined;

        const misformedRequest = () => {
            updateUserPasswordRequest.setUpdatedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Updated user id needs to be of type \"string\", \"undefined\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_type_is_not_string_but_undefined");
        }
    });

    test("Cannot update a user's password using a number as an updated user id", async () => {
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);

        const arrayInsteadOfStringInput: unknown = 1234;

        const misformedRequest = () => {
            updateUserPasswordRequest.setUpdatedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Updated user id needs to be of type \"string\", \"number\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_type_is_not_string_but_number");
        }
    });

    test("Cannot update a user's password using a function as an updated user id", async () => {
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);

        const arrayInsteadOfStringInput: unknown = function() {};

        const misformedRequest = () => {
            updateUserPasswordRequest.setUpdatedUserId(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Updated user id needs to be of type \"string\", \"function\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_type_is_not_string_but_function");
        }
    });

    test("Cannot update a user's password using a symbol as an updated user id", async () => {
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);

        const arrayInsteadOfStringInput: unknown = Symbol();

        const misformedRequest = () => {
            updateUserPasswordRequest.setUpdatedUserId(arrayInsteadOfStringInput as unknown as string);
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