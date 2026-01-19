import {afterAll, beforeAll, describe, expect, test} from '@jest/globals';

import UserAuthenticationOnPostgreSQLDatabase from "../AuthenticateUserMain/database/UserAuthenticationOnPostgreSQLDatabase";
import AuthenticateUserController from '../AuthenticateUserController/AuthenticateUserController';
import AuthenticateUserRequest from '../AuthenticateUserController/AuthenticateUserRequest';
import AuthenticationUserJoiValidation from "../AuthenticateUserMain/validation/AuthenticateUserJoiValidation";
import AuthenticateUserTypeValidator from '../AuthenticateUserMain/validation/AuthenticateUserTypeValidator';

import UserRegistrationOnPostgreSQLDatabase from "../../RegisterUser/RegisterUserMain/database/UserRegistrationOnPostgreSQLDatabase";
import RegisterUserController from '../../RegisterUser/RegisterUserController/RegisterUserController';
import RegisterUserRequest from '../../RegisterUser/RegisterUserController/RegisterUserRequest';
import type RegisterUserResponse from '../../RegisterUser/RegisterUserController/RegisterUserResponse';
import RegisterUserJoiValidation from "../../RegisterUser/RegisterUserMain/validation/RegisterUserJoiValidation";
import RegisterUserTypeValidator from '../../RegisterUser/RegisterUserMain/validation/RegisterUserTypeValidator';

import BadRequestError from '../../../services/errors/BadRequestError';
import UnauthorisedActionError from '../../../services/errors/UnauthorisedActionError';
import TypeValidator from '../../../services/validation/TypeValidator';

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

const retrieveUserRegistrationOnPostgreSQLDatabase = async (): Promise<UserRegistrationOnPostgreSQLDatabase> => {
    const userRegistrationOnPostgreSQLDatabase = new UserRegistrationOnPostgreSQLDatabase();
    await userRegistrationOnPostgreSQLDatabase.connect();

    return userRegistrationOnPostgreSQLDatabase;
}

beforeAll(async() => {
    const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
    const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();
    
    const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
    const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);
    registerUserRequest.setUsername("user")
    .setEmail("test@mail.com")
    .setPassword("Sdf sdfs sdSDFdfi 1234 !")
    .setFirstName("Bob")
    .setLastName("Bobby");
    
    const registerUserController: RegisterUserController = new RegisterUserController();
    const registerUserResponse: RegisterUserResponse = await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);
    
    expect(registerUserResponse.userIsRegistered()).toBe(true);
});

describe("test user authentication featured", () => {
    test("Empty email triggers a BadRequestError", async () => {
        const authenticateUserTypeValidator = new AuthenticateUserTypeValidator(new TypeValidator());
        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest(authenticateUserTypeValidator);

        const misformedRequest = () => {
            authenticateUserRequest.setEmail("")
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("User cannot authenticate without an email");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_not_informed");
        }
    });

    test("Empty password triggers a BadRequestError", async () => {
        const authenticateUserTypeValidator = new AuthenticateUserTypeValidator(new TypeValidator());
        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest(authenticateUserTypeValidator);

        const misformedRequest = () => {
            authenticateUserRequest.setPassword("")
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("User cannot authenticate without a password");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("password_not_informed");
        }
    });

    test("Email must be valid", async () => {
        const userAuthenticationOnPostgreSQLDatabase: UserAuthenticationOnPostgreSQLDatabase = await retrieveUserAuthenticationOnPostgreSQLDatabase();
        const authenticationUserJoiValidation: AuthenticationUserJoiValidation = new AuthenticationUserJoiValidation();

        const authenticateUserTypeValidator = new AuthenticateUserTypeValidator(new TypeValidator());
        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest(authenticateUserTypeValidator);
        authenticateUserRequest.setEmail("test@mail.c")
        .setPassword("Sdf sdfs sdSDFdfi 1234 !");

        const authenticateUserController: AuthenticateUserController = new AuthenticateUserController();

        const requestWithInvalidEmail = async () => {
            await authenticateUserController.handleAuthenticateUserRequest(authenticateUserRequest, userAuthenticationOnPostgreSQLDatabase, authenticationUserJoiValidation);
        }

        await expect(requestWithInvalidEmail()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithInvalidEmail()).rejects.toThrow("Email must be valid");

        try {
            await requestWithInvalidEmail();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_is_invalid");
        }
    });
});