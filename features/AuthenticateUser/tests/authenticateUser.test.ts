import {afterAll, describe, expect, test} from '@jest/globals';
import UserAuthenticationOnPostgreSQLDatabase from "../AuthenticateUserMain/database/UserAuthenticationOnPostgreSQLDatabase";
import AuthenticateUserController from '../AuthenticateUserController/AuthenticateUserController';
import AuthenticateUserRequest from '../AuthenticateUserController/AuthenticateUserRequest';
import type AuthenticateUserResponse from '../AuthenticateUserController/AuthenticateUserResponse';

import UserRegistrationOnPostgreSQLDatabase from "../../RegisterUser/RegisterUserMain/database/UserRegistrationOnPostgreSQLDatabase";
import RegisterUserController from '../../RegisterUser/RegisterUserController/RegisterUserController';
import RegisterUserRequest from '../../RegisterUser/RegisterUserController/RegisterUserRequest';
import type RegisterUserResponse from '../../RegisterUser/RegisterUserController/RegisterUserResponse';
import JoiValidation from "../../RegisterUser/RegisterUserMain/validation/JoiValidation";

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
    test("Can authentication a registered user", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const joiValidation: JoiValidation = new JoiValidation();

        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest();
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.com")
        .setPassword("Sdf sdfs sdSDFdfi 1234 !")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();
        const registerUserResponse: RegisterUserResponse = await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, joiValidation);

        expect(registerUserResponse.userIsRegistered()).toBe(true);

        const userAuthenticationOnPostgreSQLDatabase: UserAuthenticationOnPostgreSQLDatabase = await retrieveUserAuthenticationOnPostgreSQLDatabase();

        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest();
        authenticateUserRequest.setEmail("user")
        .setPassword("test@mail.com");

        const authenticateUserController: AuthenticateUserController = new AuthenticateUserController();
        const authenticateUserResponse: AuthenticateUserResponse = await authenticateUserController.handleAuthenticateUserRequest(authenticateUserRequest, userAuthenticationOnPostgreSQLDatabase);

        expect(authenticateUserResponse.userIsLoggedIn()).toBe(true);
    })
});