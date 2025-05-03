import {afterAll, describe, expect, test} from '@jest/globals';
import UserRegistrationOnPostgreSQLDatabase from "../RegisterUserMain/database/UserRegistrationOnPostgreSQLDatabase";
import RegisterUserController from '../RegisterUserController/RegisterUserController';
import RegisterUserRequest from '../RegisterUserController/RegisterUserRequest';
import type RegisterUserResponse from '../RegisterUserController/RegisterUserResponse';
import BadRequestError from '../../../services/errors/BadRequestError';

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

        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest();
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.com")
        .setPassword("Sdf sdfs sdfsdfi 1234 !")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();
        const registerUserResponse: RegisterUserResponse = await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase);

        expect(registerUserResponse.userIsRegistered()).toBe(true);
    });

    test("Cannot register a user without a username", async () => {
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest();

        const misformedRequest = () => {
            registerUserRequest.setUsername("")
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("User cannot register without a username");
    });
});