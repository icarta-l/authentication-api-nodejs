import {afterAll, describe, expect, test} from '@jest/globals';
import PostgreSQLDatabase from "../../../services/database/PostgreSQLDatabase";
import RegisterUserController from '../RegisterUserController/RegisterUserController';
import RegisterUserRequest from '../RegisterUserController/RegisterUserRequest';
import type RegisterUserResponse from '../RegisterUserController/RegisterUserResponse';

afterAll(async() => {
    const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    await postgreSQLDatabase.connect();
    await postgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await postgreSQLDatabase.close();
});

describe("Test register user feature", () => {
    test("Can register a new user", () => {
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest();
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.com")
        .setPassword("Sdf sdfs sdfsdfi 1234 !")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();
        const registerUserResponse: RegisterUserResponse = registerUserController.handleRegisterUserRequest(registerUserRequest);

        expect(registerUserResponse.userIsRegistered()).toBe(true);
    })
});