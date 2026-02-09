import {afterAll, describe, expect, test} from '@jest/globals';

import UserRegistrationOnPostgreSQLDatabase from "../RegisterUserMain/database/UserRegistrationOnPostgreSQLDatabase";
import RegisterUserController from '../RegisterUserController/RegisterUserController';
import RegisterUserRequest from '../RegisterUserController/RegisterUserRequest';
import RegisterUserJoiValidation from "../RegisterUserMain/validation/RegisterUserJoiValidation";
import RegisterUserTypeValidator from '../RegisterUserMain/validation/RegisterUserTypeValidator';

import BadRequestError from '../../../../services/errors/BadRequestError';
import UnauthorisedActionError from '../../../../services/errors/UnauthorisedActionError';

import TypeValidator from '../../../../services/validation/TypeValidator';

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
    test("Cannot register a user without a username", async () => {
        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);

        const misformedRequest = () => {
            registerUserRequest.setUsername("")
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("User cannot register without a username");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("username_not_informed");
        }
    });

    test("Cannot register a user without a password", async () => {
        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);

        const misformedRequest = () => {
            registerUserRequest.setPassword("")
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("User cannot register without a password");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("password_not_informed");
        }
    });

    test("Cannot register a user without an email", async () => {
        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);

        const misformedRequest = () => {
            registerUserRequest.setEmail("")
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("User cannot register without an email");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_not_informed");
        }
    });

    test("Username needs to have at least 3 letters", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();

        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);
        registerUserRequest.setUsername("1234")
        .setEmail("test@mail.com")
        .setPassword("Sdf sdfs sdfsdfi 1234 !")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();

        const requestWithNumericalUsername = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);
        }

        await expect(requestWithNumericalUsername()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithNumericalUsername()).rejects.toThrow("Username needs to have at least 3 letters");

        try {
            await requestWithNumericalUsername();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("username_must_have_at_least_3_letters");
        }
    });

    test("Username needs to be only letters, numbers and underscores", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();

        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);
        registerUserRequest.setUsername("asdb!#asdf")
        .setEmail("test@mail.com")
        .setPassword("Sdf sdfs sdfsdfi 1234 !")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();

        const requestWithUnauthorisedSpecialCharacters = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);
        }

        await expect(requestWithUnauthorisedSpecialCharacters()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithUnauthorisedSpecialCharacters()).rejects.toThrow("Username can only contain letters, numbers and underscores");

        try {
            await requestWithUnauthorisedSpecialCharacters();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("username_has_special_characters");
        }
    });

    test("Email must be valid", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();

        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.c")
        .setPassword("Sdf sdfs sdfsdfi 1234 !")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();

        const requestWithInvalidEmail = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);
        }

        await expect(requestWithInvalidEmail()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithInvalidEmail()).rejects.toThrow("Email must be valid");

        try {
            await requestWithInvalidEmail();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("email_is_invalid");
        }
    });

    test("Password should be at least 12 characters long", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();

        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.com")
        .setPassword("Sdf")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();

        const requestWithTooShortPassword = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);
        }

        await expect(requestWithTooShortPassword()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithTooShortPassword()).rejects.toThrow("Password must be at least 12 characters long");

        try {
            await requestWithTooShortPassword();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("password_doesnt_have_12_characters");
        }
    });

    test("Password should have at least 3 lowercase letters", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();

        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.com")
        .setPassword("SDSDFSDFSDFSDF")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();

        const requestWithTooShortPassword = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);
        }

        await expect(requestWithTooShortPassword()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithTooShortPassword()).rejects.toThrow("Password needs to have at least 3 lowercase letters");

        try {
            await requestWithTooShortPassword();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("password_doesnt_have_3_lowercase_letters");
        }
    });

    test("Password should have at least 3 uppercase letters", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();

        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.com")
        .setPassword("asdfsadfsdfsdfasf")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();

        const requestWithTooShortPassword = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);
        }

        await expect(requestWithTooShortPassword()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithTooShortPassword()).rejects.toThrow("Password needs to have at least 3 uppercase letters");

        try {
            await requestWithTooShortPassword();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("password_doesnt_have_3_uppercase_letters");
        }
    });

    test("Password should have at least 3 symbols, special characters or space", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();

        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.com")
        .setPassword("SDfsdfsdfsFSDfsdfsfSdfSdf")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();

        const requestWithTooShortPassword = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);
        }

        await expect(requestWithTooShortPassword()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithTooShortPassword()).rejects.toThrow("Password needs to have at least 3 symbols, special characters or space");

        try {
            await requestWithTooShortPassword();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("password_miss_special_characters");
        }
    });

    test("Password should have at least 3 numbers", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();

        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.com")
        .setPassword("SDfsdf sdfsFSDfs dfsfSd fSdf")
        .setFirstName("Bob")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();

        const requestWithTooShortPassword = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);
        }

        await expect(requestWithTooShortPassword()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithTooShortPassword()).rejects.toThrow("Password needs to have at least 3 numbers");

        try {
            await requestWithTooShortPassword();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("password_doesnt_have_3_numbers");
        }
    });

    test("Firstname needs to have letters only", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();

        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.com")
        .setPassword("Sdf sSDF sdfsdfi 1234 !")
        .setFirstName("1231231")
        .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();

        const requestWithNumericalFirstName = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);
        }

        await expect(requestWithNumericalFirstName()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithNumericalFirstName()).rejects.toThrow("Firstname needs to have letters only");

        try {
            await requestWithNumericalFirstName();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("first_name_not_letters_only");
        }
    });

    test("Lastname needs to have letters only", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();

        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.com")
        .setPassword("Sdf sSDF sdfsdfi 1234 !")
        .setFirstName("Bob")
        .setLastName("123123123");

        const registerUserController: RegisterUserController = new RegisterUserController();

        const requestWithNumericalLastName = async () => {
            await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);
        }

        await expect(requestWithNumericalLastName()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestWithNumericalLastName()).rejects.toThrow("Lastname needs to have letters only");

        try {
            await requestWithNumericalLastName();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("last_name_not_letters_only");
        }
    });
});