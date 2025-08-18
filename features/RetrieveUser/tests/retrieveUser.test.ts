import {afterAll, describe, expect, test} from '@jest/globals';

import UserRegistrationOnPostgreSQLDatabase from "../../RegisterUser/RegisterUserMain/database/UserRegistrationOnPostgreSQLDatabase";
import RegisterUserController from '../../RegisterUser/RegisterUserController/RegisterUserController';
import RegisterUserRequest from '../../RegisterUser/RegisterUserController/RegisterUserRequest';
import type RegisterUserResponse from '../../RegisterUser/RegisterUserController/RegisterUserResponse';
import RegisterUserJoiValidation from "../../RegisterUser/RegisterUserMain/validation/JoiValidation";
import BadRequestError from '../../../services/errors/BadRequestError';
import UnauthorisedActionError from '../../../services/errors/UnauthorisedActionError';

import UserAuthenticationOnPostgreSQLDatabase from "../../AuthenticateUser/AuthenticateUserMain/database/UserAuthenticationOnPostgreSQLDatabase";
import AuthenticateUserController from '../../AuthenticateUser/AuthenticateUserController/AuthenticateUserController';
import AuthenticateUserRequest from '../../AuthenticateUser/AuthenticateUserController/AuthenticateUserRequest';
import type AuthenticateUserResponse from '../../AuthenticateUser/AuthenticateUserController/AuthenticateUserResponse';
import AuthenticationUserJoiValidation from "../../AuthenticateUser/AuthenticateUserMain/validation/JoiValidation";

import UserRetrievalOnPostgreSQLDatabase from "../RetrieveUserMain/database/UserRetrievalOnPostgreSQLDatabase";
import RetrieveUserJoiValidation from "../RetrieveUserMain/validation/RetrieveUserJoiValidation";
import RetrieveUserRequest from "../RetrieveUserController/RetrieveUserRequest";
import RetrieveUserResponse from "../RetrieveUserController/RetrieveUserResponse";

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

const retrieveUserAuthenticationOnPostgreSQLDatabase = async (): Promise<UserAuthenticationOnPostgreSQLDatabase> => {
    const userAuthenticationOnPostgreSQLDatabase = new UserAuthenticationOnPostgreSQLDatabase();
    await userAuthenticationOnPostgreSQLDatabase.connect();

    return userAuthenticationOnPostgreSQLDatabase;
}

const retrieveUserRetrievalOnPostgreSQLDatabase = async (): Promise<UserRetrievalOnPostgreSQLDatabase> => {
    const userRetrievalOnPostgreSQLDatabase = new UserRetrievalOnPostgreSQLDatabase();
    await userRetrievalOnPostgreSQLDatabase.connect();

    return userRetrievalOnPostgreSQLDatabase;
}

describe("test user retrieval feature", () => {
    test("Can retrieve an existing user", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();
        const authenticationUserJoiValidation: AuthenticationUserJoiValidation = new AuthenticationUserJoiValidation();
        const retrieveUserJoiValidation: RetrieveUserJoiValidation = new RetrieveUserJoiValidation();

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

        const userRetrievalOnPostgreSQLDatabase: UserRetrievalOnPostgreSQLDatabase = await retrieveUserRetrievalOnPostgreSQLDatabase();

        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest();
        retrieveUserRequest.setUserId(authenticateUserResponse.getUserId());

        const retrieveUserController: RetrieveUserController = new RetrieveUserController();
        const retrieveUserResponse: RetrieveUserResponse = await retrieveUserController.handleAuthenticateUserRequest(retrieveUserRequest, userRetrievalOnPostgreSQLDatabase, retrieveUserJoiValidation);

        expect(retrieveUserResponse.getUsername()).toBe("user");
        expect(retrieveUserResponse.getEmail()).toBe("test@mail.com");
        expect(retrieveUserResponse.getFirstName()).toBe("Bob");
        expect(retrieveUserResponse.getLastName()).toBe("Bobby");
        expect(retrieveUserResponse.getUserId()).toBe(authenticateUserResponse.getUserId());
    });
});