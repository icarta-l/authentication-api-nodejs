import {afterAll, beforeAll, describe, expect, test} from "@jest/globals";

import UserRegistrationOnPostgreSQLDatabase from "../../RegisterUser/RegisterUserMain/database/UserRegistrationOnPostgreSQLDatabase";
import RegisterUserController from "../../RegisterUser/RegisterUserController/RegisterUserController";
import RegisterUserRequest from "../../RegisterUser/RegisterUserController/RegisterUserRequest";
import type RegisterUserResponse from "../../RegisterUser/RegisterUserController/RegisterUserResponse";
import RegisterUserJoiValidation from "../../RegisterUser/RegisterUserMain/validation/RegisterUserJoiValidation";
import RegisterUserTypeValidator from "../../RegisterUser/RegisterUserMain/validation/RegisterUserTypeValidator";

import UserAuthenticationOnPostgreSQLDatabase from "../../AuthenticateUser/AuthenticateUserMain/database/UserAuthenticationOnPostgreSQLDatabase";
import AuthenticateUserController from "../../AuthenticateUser/AuthenticateUserController/AuthenticateUserController";
import AuthenticateUserRequest from "../../AuthenticateUser/AuthenticateUserController/AuthenticateUserRequest";
import type AuthenticateUserResponse from "../../AuthenticateUser/AuthenticateUserController/AuthenticateUserResponse";
import AuthenticationUserJoiValidation from "../../AuthenticateUser/AuthenticateUserMain/validation/AuthenticateUserJoiValidation";
import AuthenticateUserTypeValidator from "../../AuthenticateUser/AuthenticateUserMain/validation/AuthenticateUserTypeValidator";

import UserRetrievalOnPostgreSQLDatabase from "../RetrieveUserMain/database/UserRetrievalOnPostgreSQLDatabase";
import RetrieveUserInputJoiValidation from "../RetrieveUserMain/validation/RetrieveUserInputJoiValidation";
import RetrieveUserOutputJoiValidation from "../RetrieveUserMain/validation/RetrieveUserOutputJoiValidation";
import RetrieveUserRequest from "../RetrieveUserController/RetrieveUserRequest";
import RetrieveUserResponse from "../RetrieveUserController/RetrieveUserResponse";
import RetrieveUserController from "../RetrieveUserController/RetrieveUserController";
import RetrieveUserTypeValidator from "../RetrieveUserMain/validation/RetrieveUserTypeValidator";

import UnauthorisedActionError from "../../../services/errors/UnauthorisedActionError";
import TypeValidator from "../../../services/validation/TypeValidator";

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

let testedUserID!: string; 
const username = "user";

beforeAll( async() => {
    const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
    const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();
    const authenticationUserJoiValidation: AuthenticationUserJoiValidation = new AuthenticationUserJoiValidation();

    const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
    const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);
        registerUserRequest.setUsername(username)
        .setEmail("test@mail.com")
        .setPassword("Sdf sdfs sdSDFdfi 1234 !")
        .setFirstName("Bob")
        .setLastName("Bobby");

    const registerUserController: RegisterUserController = new RegisterUserController();
    const registerUserResponse: RegisterUserResponse = await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);

    expect(registerUserResponse.userIsRegistered()).toBe(true);

    const userAuthenticationOnPostgreSQLDatabase: UserAuthenticationOnPostgreSQLDatabase = await retrieveUserAuthenticationOnPostgreSQLDatabase();
    
    const authenticateUserTypeValidator = new AuthenticateUserTypeValidator(new TypeValidator());
    const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest(authenticateUserTypeValidator);
    authenticateUserRequest.setEmail("test@mail.com")
    .setPassword("Sdf sdfs sdSDFdfi 1234 !");

    const authenticateUserController: AuthenticateUserController = new AuthenticateUserController();
    const authenticateUserResponse: AuthenticateUserResponse = await authenticateUserController.handleAuthenticateUserRequest(authenticateUserRequest, userAuthenticationOnPostgreSQLDatabase, authenticationUserJoiValidation);

    expect(authenticateUserResponse.userIsLoggedIn()).toBe(true);
    expect(authenticateUserResponse.getUserId().length).toBeGreaterThan(0);

    testedUserID = authenticateUserResponse.getUserId();
});

describe("test user retrieval feature", () => {
    test("Can retrieve an existing user", async () => {
        const retrieveUserInputJoiValidation: RetrieveUserInputJoiValidation = new RetrieveUserInputJoiValidation();
        const retrieveUserOutputJoiValidation: RetrieveUserOutputJoiValidation = new RetrieveUserOutputJoiValidation();
        const userRetrievalOnPostgreSQLDatabase: UserRetrievalOnPostgreSQLDatabase = await retrieveUserRetrievalOnPostgreSQLDatabase();

        const retrieveUserTypeValidator = new RetrieveUserTypeValidator(new TypeValidator());
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest(retrieveUserTypeValidator);
        retrieveUserRequest.setRequestedUserId(testedUserID);

        const retrieveUserController: RetrieveUserController = new RetrieveUserController();
        const retrieveUserResponse: RetrieveUserResponse = await retrieveUserController.handleRetrieveUserRequest(retrieveUserRequest, userRetrievalOnPostgreSQLDatabase, retrieveUserInputJoiValidation, retrieveUserOutputJoiValidation);

        expect(retrieveUserResponse.getUsername()).toBe(username);
        expect(retrieveUserResponse.getEmail()).toBe("test@mail.com");
        expect(retrieveUserResponse.getFirstName()).toBe("Bob");
        expect(retrieveUserResponse.getLastName()).toBe("Bobby");
        expect(retrieveUserResponse.getUserId()).toBe(testedUserID);
    });

    test("Cannot retrieve a non-existent user", async () => {
        const retrieveUserTypeValidator = new RetrieveUserTypeValidator(new TypeValidator());
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest(retrieveUserTypeValidator);
        retrieveUserRequest.setRequestedUserId("1231231231223212312");

        const retrieveUserController: RetrieveUserController = new RetrieveUserController();
        const userRetrievalOnPostgreSQLDatabase: UserRetrievalOnPostgreSQLDatabase = await retrieveUserRetrievalOnPostgreSQLDatabase();
        const retrieveUserInputJoiValidation: RetrieveUserInputJoiValidation = new RetrieveUserInputJoiValidation();
        const retrieveUserOutputJoiValidation: RetrieveUserOutputJoiValidation = new RetrieveUserOutputJoiValidation();

        const requestForNonExistentUser = async () => {
            await retrieveUserController.handleRetrieveUserRequest(retrieveUserRequest, userRetrievalOnPostgreSQLDatabase, retrieveUserInputJoiValidation, retrieveUserOutputJoiValidation);
        }

        await expect(requestForNonExistentUser()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestForNonExistentUser()).rejects.toThrow("Requested user could not be retrieved");

        try {
            await requestForNonExistentUser();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("requested_user_could_not_be_retrieved");
        }
    });
});