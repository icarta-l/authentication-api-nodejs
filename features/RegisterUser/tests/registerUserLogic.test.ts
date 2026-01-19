import {afterAll, describe, expect, test} from '@jest/globals';

import UserRegistrationOnPostgreSQLDatabase from "../RegisterUserMain/database/UserRegistrationOnPostgreSQLDatabase";
import RegisterUserController from '../RegisterUserController/RegisterUserController';
import RegisterUserRequest from '../RegisterUserController/RegisterUserRequest';
import type RegisterUserResponse from '../RegisterUserController/RegisterUserResponse';
import RegisterUserTypeValidator from '../RegisterUserMain/validation/RegisterUserTypeValidator';

import UnauthorisedActionError from '../../../services/errors/UnauthorisedActionError';
import RegisterUserJoiValidation from "../RegisterUserMain/validation/RegisterUserJoiValidation";

import TypeValidator from '../../../services/validation/TypeValidator';

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

describe("Test register user feature", () => {
    test("Can register a new user", async () => {
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
    

    test("Can register a new user without first name or last name", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();

        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);
        registerUserRequest.setUsername("user2")
        .setEmail("test2@mail.com")
        .setPassword("Sdf sdfs sdfsSDfSDdfi 1234 !");

        const registerUserController: RegisterUserController = new RegisterUserController();
        const registerUserResponse: RegisterUserResponse = await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);

        expect(registerUserResponse.userIsRegistered()).toBe(true);
    });

    test("Cannot register a new user with an already registered email address", async () => {
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

        const requestWithNumericalLastName = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);
        }

        await expect(requestWithNumericalLastName()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithNumericalLastName()).rejects.toThrow("Email was already registered by another user");

        try {
            await requestWithNumericalLastName();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_is_already_registered");
        }
    });
});