import {afterAll, describe, expect, test} from "@jest/globals";

import UserRegistrationOnPostgreSQLDatabase from "../../RegisterUserMain/database/UserRegistrationOnPostgreSQLDatabase";
import RegisterUserRequest from "../../RegisterUserController/RegisterUserRequest";
import RegisterUserTypeValidator from "../../RegisterUserMain/validation/RegisterUserTypeValidator";

import TypeValidator from "../../../../../services/validation/TypeValidator";

import BadRequestError from "../../../../../services/errors/BadRequestError";

afterAll(async() => {
    const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
    await userRegistrationOnPostgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await userRegistrationOnPostgreSQLDatabase.close();
});

const retrieveUserRegistrationOnPostgreSQLDatabase = async (): Promise<UserRegistrationOnPostgreSQLDatabase> => {
    const userRegistrationOnPostgreSQLDatabase = new UserRegistrationOnPostgreSQLDatabase();
    await userRegistrationOnPostgreSQLDatabase.connect();

    return userRegistrationOnPostgreSQLDatabase;
}

describe("test user registration feature email type validation", () => {
    test("Cannot update a user using an array as an email", async () => {
        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = ["value"];

        const misformedRequest = () => {
            registerUserRequest.setEmail(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Email needs to be of type \"string\", \"array\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_type_is_not_string_but_array");
        }
    });

    test("Cannot update a user using an object as an email", async () => {
        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = {};

        const misformedRequest = () => {
            registerUserRequest.setEmail(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Email needs to be of type \"string\", \"object\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_type_is_not_string_but_object");
        }
    });

    test("Cannot update a user using null as an email", async () => {
        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = null;

        const misformedRequest = () => {
            registerUserRequest.setEmail(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Email needs to be of type \"string\", \"null\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_type_is_not_string_but_null");
        }
    });

    test("Cannot update a user using a boolean as an email", async () => {
        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = true;

        const misformedRequest = () => {
            registerUserRequest.setEmail(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Email needs to be of type \"string\", \"boolean\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_type_is_not_string_but_boolean");
        }
    });

    test("Cannot update a user using undefined as an email", async () => {
        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = undefined;

        const misformedRequest = () => {
            registerUserRequest.setEmail(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Email needs to be of type \"string\", \"undefined\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_type_is_not_string_but_undefined");
        }
    });

    test("Cannot update a user using a number as an email", async () => {
        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = 1234;

        const misformedRequest = () => {
            registerUserRequest.setEmail(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Email needs to be of type \"string\", \"number\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_type_is_not_string_but_number");
        }
    });

    test("Cannot update a user using a function as an email", async () => {
        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = function() {};

        const misformedRequest = () => {
            registerUserRequest.setEmail(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Email needs to be of type \"string\", \"function\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_type_is_not_string_but_function");
        }
    });

    test("Cannot update a user using a symbol as an email", async () => {
        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = Symbol();

        const misformedRequest = () => {
            registerUserRequest.setEmail(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Email needs to be of type \"string\", \"symbol\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_type_is_not_string_but_symbol");
        }
    });
});