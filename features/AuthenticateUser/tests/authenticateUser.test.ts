import {afterAll, describe, expect, test} from '@jest/globals';
import UserAuthenticationOnPostgreSQLDatabase from "../AuthenticateUserMain/database/UserAuthenticationOnPostgreSQLDatabase";
import AuthenticateUserController from '../AuthenticateUserController/AuthenticateUserController';
import AuthenticateUserRequest from '../AuthenticateUserController/AuthenticateUserRequest';
import type AuthenticateUserResponse from '../AuthenticateUserController/AuthenticateUserResponse';
import AuthenticationUserJoiValidation from "../AuthenticateUserMain/validation/JoiValidation";

import UserRegistrationOnPostgreSQLDatabase from "../../RegisterUser/RegisterUserMain/database/UserRegistrationOnPostgreSQLDatabase";
import RegisterUserController from '../../RegisterUser/RegisterUserController/RegisterUserController';
import RegisterUserRequest from '../../RegisterUser/RegisterUserController/RegisterUserRequest';
import type RegisterUserResponse from '../../RegisterUser/RegisterUserController/RegisterUserResponse';
import RegisterUserJoiValidation from "../../RegisterUser/RegisterUserMain/validation/JoiValidation";
import BadRequestError from '../../../services/errors/BadRequestError';
import UnauthorisedActionError from '../../../services/errors/UnauthorisedActionError';

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

describe("test user authentication featured", () => {
    test("Can authenticate a registered user", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();
        const authenticationUserJoiValidation: AuthenticationUserJoiValidation = new AuthenticationUserJoiValidation();

        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest();
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.com")
        .setPassword("Sdf sdfs sdSDFdfi 1234 !")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();
        const registerUserResponse: RegisterUserResponse = await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);

        expect(registerUserResponse.userIsRegistered()).toBe(true);

        const userAuthenticationOnPostgreSQLDatabase: UserAuthenticationOnPostgreSQLDatabase = await retrieveUserAuthenticationOnPostgreSQLDatabase();

        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest();
        authenticateUserRequest.setEmail("test@mail.com")
        .setPassword("Sdf sdfs sdSDFdfi 1234 !");

        const authenticateUserController: AuthenticateUserController = new AuthenticateUserController();
        const authenticateUserResponse: AuthenticateUserResponse = await authenticateUserController.handleAuthenticateUserRequest(authenticateUserRequest, userAuthenticationOnPostgreSQLDatabase, authenticationUserJoiValidation);

        expect(authenticateUserResponse.userIsLoggedIn()).toBe(true);
        expect(authenticateUserResponse.getUserId().length).toBeGreaterThan(0);
    });

    test("Empty email triggers a BadRequestError", async () => {
        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest();

        const misformedRequest = () => {
            authenticateUserRequest.setEmail("")
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("User cannot authenticate without an email");
    });

    test("Empty password triggers a BadRequestError", async () => {
        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest();

        const misformedRequest = () => {
            authenticateUserRequest.setPassword("")
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("User cannot authenticate without a password");
    });

    test("Email must be valid", async () => {
        const userAuthenticationOnPostgreSQLDatabase: UserAuthenticationOnPostgreSQLDatabase = await retrieveUserAuthenticationOnPostgreSQLDatabase();
        const authenticationUserJoiValidation: AuthenticationUserJoiValidation = new AuthenticationUserJoiValidation();

        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest();
        authenticateUserRequest.setEmail("test@mail.c")
        .setPassword("Sdf sdfs sdSDFdfi 1234 !");

        const authenticateUserController: AuthenticateUserController = new AuthenticateUserController();

        const requestWithInvalidEmail = async () => {
            await authenticateUserController.handleAuthenticateUserRequest(authenticateUserRequest, userAuthenticationOnPostgreSQLDatabase, authenticationUserJoiValidation);
        }

        await expect(requestWithInvalidEmail()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithInvalidEmail()).rejects.toThrow("Email must be valid");
    });
});