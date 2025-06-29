import {afterAll, describe, expect, test} from '@jest/globals';
import UserRegistrationOnPostgreSQLDatabase from "../RegisterUserMain/database/UserRegistrationOnPostgreSQLDatabase";
import RegisterUserController from '../RegisterUserController/RegisterUserController';
import RegisterUserRequest from '../RegisterUserController/RegisterUserRequest';
import type RegisterUserResponse from '../RegisterUserController/RegisterUserResponse';
import BadRequestError from '../../../services/errors/BadRequestError';
import UnauthorisedActionError from '../../../services/errors/UnauthorisedActionError';
import JoiValidation from "../RegisterUserMain/validation/JoiValidation";

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
    });

    test("Cannot register a user without a username", async () => {
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest();

        const misformedRequest = () => {
            registerUserRequest.setUsername("")
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("User cannot register without a username");
    });

    test("Cannot register a user without a password", async () => {
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest();

        const misformedRequest = () => {
            registerUserRequest.setPassword("")
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("User cannot register without a password");
    });

    test("Cannot register a user without an email", async () => {
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest();

        const misformedRequest = () => {
            registerUserRequest.setEmail("")
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("User cannot register without an email");
    });

    test("Can register a new user without first name or last name", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const joiValidation: JoiValidation = new JoiValidation();

        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest();
        registerUserRequest.setUsername("user2")
        .setEmail("test2@mail.com")
        .setPassword("Sdf sdfs sdfsSDfSDdfi 1234 !");

        const registerUserController: RegisterUserController = new RegisterUserController();
        const registerUserResponse: RegisterUserResponse = await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, joiValidation);

        expect(registerUserResponse.userIsRegistered()).toBe(true);
    });

    test("Username needs to have at least 3 letters", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const joiValidation: JoiValidation = new JoiValidation();

        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest();
        registerUserRequest.setUsername("1234")
        .setEmail("test@mail.com")
        .setPassword("Sdf sdfs sdfsdfi 1234 !")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();

        const requestWithNumericalUsername = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, joiValidation);
        }

        await expect(requestWithNumericalUsername()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithNumericalUsername()).rejects.toThrow("Username needs to have at least 3 letters");
    });

    test("Username needs to be only letters, numbers and underscores", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const joiValidation: JoiValidation = new JoiValidation();

        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest();
        registerUserRequest.setUsername("asdb!#asdf")
        .setEmail("test@mail.com")
        .setPassword("Sdf sdfs sdfsdfi 1234 !")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();

        const requestWithUnauthorisedSpecialCharacters = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, joiValidation);
        }

        await expect(requestWithUnauthorisedSpecialCharacters()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithUnauthorisedSpecialCharacters()).rejects.toThrow("Username can only contain letters, numbers and underscores");
    });

    test("Email must be valid", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const joiValidation: JoiValidation = new JoiValidation();

        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest();
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.c")
        .setPassword("Sdf sdfs sdfsdfi 1234 !")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();

        const requestWithInvalidEmail = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, joiValidation);
        }

        await expect(requestWithInvalidEmail()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithInvalidEmail()).rejects.toThrow("Email must be valid");
    });

    test("Password should be at least 12 characters long", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const joiValidation: JoiValidation = new JoiValidation();

        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest();
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.com")
        .setPassword("Sdf")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();

        const requestWithTooShortPassword = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, joiValidation);
        }

        await expect(requestWithTooShortPassword()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithTooShortPassword()).rejects.toThrow("Password must be at least 12 characters long");
    });

    test("Password should have at least 3 lowercase letters", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const joiValidation: JoiValidation = new JoiValidation();

        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest();
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.com")
        .setPassword("SDSDFSDFSDFSDF")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();

        const requestWithTooShortPassword = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, joiValidation);
        }

        await expect(requestWithTooShortPassword()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithTooShortPassword()).rejects.toThrow("Password needs to have at least 3 lowercase letters");
    });

    test("Password should have at least 3 uppercase letters", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const joiValidation: JoiValidation = new JoiValidation();

        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest();
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.com")
        .setPassword("asdfsadfsdfsdfasf")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();

        const requestWithTooShortPassword = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, joiValidation);
        }

        await expect(requestWithTooShortPassword()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithTooShortPassword()).rejects.toThrow("Password needs to have at least 3 uppercase letters");
    });

    test("Password should have at least 3 symbols, special characters or space", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const joiValidation: JoiValidation = new JoiValidation();

        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest();
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.com")
        .setPassword("SDfsdfsdfsFSDfsdfsfSdfSdf")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();

        const requestWithTooShortPassword = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, joiValidation);
        }

        await expect(requestWithTooShortPassword()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithTooShortPassword()).rejects.toThrow("Password needs to have at least 3 symbols, special characters or space");
    });

    test("Password should have at least 3 numbers", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const joiValidation: JoiValidation = new JoiValidation();

        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest();
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.com")
        .setPassword("SDfsdf sdfsFSDfs dfsfSd fSdf")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();

        const requestWithTooShortPassword = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, joiValidation);
        }

        await expect(requestWithTooShortPassword()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithTooShortPassword()).rejects.toThrow("Password needs to have at least 3 numbers");
    });
});