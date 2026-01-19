import {afterAll, describe, expect, test} from "@jest/globals";

import UserAuthenticationOnPostgreSQLDatabase from "../../AuthenticateUserMain/database/UserAuthenticationOnPostgreSQLDatabase";
import AuthenticateUserRequest from "../../AuthenticateUserController/AuthenticateUserRequest";
import AuthenticateUserTypeValidator from "../../AuthenticateUserMain/validation/AuthenticateUserTypeValidator";

import TypeValidator from "../../../../services/validation/TypeValidator";

import BadRequestError from "../../../../services/errors/BadRequestError";

afterAll(async() => {
    const userAuthenticationOnPostgreSQLDatabase: UserAuthenticationOnPostgreSQLDatabase = await retrieveUserAuthenticationOnPostgreSQLDatabase();
    await userAuthenticationOnPostgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await userAuthenticationOnPostgreSQLDatabase.close();
});

const retrieveUserAuthenticationOnPostgreSQLDatabase = async (): Promise<UserAuthenticationOnPostgreSQLDatabase> => {
    const userAuthenticationOnPostgreSQLDatabase = new UserAuthenticationOnPostgreSQLDatabase();
    await userAuthenticationOnPostgreSQLDatabase.connect();

    return userAuthenticationOnPostgreSQLDatabase;
}

describe("test user authentication feature email type validation", () => {
    test("Cannot authenticate a user using an array as an email", async () => {
        const authenticateUserTypeValidator = new AuthenticateUserTypeValidator(new TypeValidator());
        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest(authenticateUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = ["value"];

        const misformedRequest = () => {
            authenticateUserRequest.setEmail(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Email needs to be of type \"string\", \"array\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_type_is_not_string_but_array");
        }
    });

    test("Cannot authenticate a user using an object as an email", async () => {
        const authenticateUserTypeValidator = new AuthenticateUserTypeValidator(new TypeValidator());
        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest(authenticateUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = {};

        const misformedRequest = () => {
            authenticateUserRequest.setEmail(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Email needs to be of type \"string\", \"object\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_type_is_not_string_but_object");
        }
    });

    test("Cannot authenticate a user using null as an email", async () => {
        const authenticateUserTypeValidator = new AuthenticateUserTypeValidator(new TypeValidator());
        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest(authenticateUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = null;

        const misformedRequest = () => {
            authenticateUserRequest.setEmail(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Email needs to be of type \"string\", \"null\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_type_is_not_string_but_null");
        }
    });

    test("Cannot authenticate a user using a boolean as an email", async () => {
        const authenticateUserTypeValidator = new AuthenticateUserTypeValidator(new TypeValidator());
        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest(authenticateUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = true;

        const misformedRequest = () => {
            authenticateUserRequest.setEmail(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Email needs to be of type \"string\", \"boolean\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_type_is_not_string_but_boolean");
        }
    });

    test("Cannot authenticate a user using undefined as an email", async () => {
        const authenticateUserTypeValidator = new AuthenticateUserTypeValidator(new TypeValidator());
        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest(authenticateUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = undefined;

        const misformedRequest = () => {
            authenticateUserRequest.setEmail(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Email needs to be of type \"string\", \"undefined\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_type_is_not_string_but_undefined");
        }
    });

    test("Cannot authenticate a user using a number as an email", async () => {
        const authenticateUserTypeValidator = new AuthenticateUserTypeValidator(new TypeValidator());
        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest(authenticateUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = 1234;

        const misformedRequest = () => {
            authenticateUserRequest.setEmail(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Email needs to be of type \"string\", \"number\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_type_is_not_string_but_number");
        }
    });

    test("Cannot authenticate a user using a function as an email", async () => {
        const authenticateUserTypeValidator = new AuthenticateUserTypeValidator(new TypeValidator());
        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest(authenticateUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = function() {};

        const misformedRequest = () => {
            authenticateUserRequest.setEmail(arrayInsteadOfStringInput as unknown as string);
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Email needs to be of type \"string\", \"function\" given");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_type_is_not_string_but_function");
        }
    });

    test("Cannot authenticate a user using a symbol as an email", async () => {
        const authenticateUserTypeValidator = new AuthenticateUserTypeValidator(new TypeValidator());
        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest(authenticateUserTypeValidator);

        const arrayInsteadOfStringInput: unknown = Symbol();

        const misformedRequest = () => {
            authenticateUserRequest.setEmail(arrayInsteadOfStringInput as unknown as string);
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