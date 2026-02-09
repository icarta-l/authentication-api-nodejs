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
import RetrieveUserController from "../RetrieveUserController/RetrieveUserController";
import RetrieveUserTypeValidator from "../RetrieveUserMain/validation/RetrieveUserTypeValidator";

import BadRequestError from "../../../../services/errors/BadRequestError";
import UnauthorisedActionError from "../../../../services/errors/UnauthorisedActionError";
import InvalidRetrievedValuesError from "../../../../services/errors/InvalidRetrievedValuesError";
import TypeValidator from "../../../../services/validation/TypeValidator";

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
    test("Cannot retrieve a user without a requested user id", async () => {
        const retrieveUserTypeValidator = new RetrieveUserTypeValidator(new TypeValidator());
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest(retrieveUserTypeValidator);

        const misformedRequest = () => {
            retrieveUserRequest.setRequestedUserId("")
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Cannot retrieve a user without a requested user id");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("user_id_not_informed");
        }
    });

    test("Cannot request a user with a user ID that is not alphanumerical", async () => {
        const retrieveUserTypeValidator = new RetrieveUserTypeValidator(new TypeValidator());
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest(retrieveUserTypeValidator);
        retrieveUserRequest.setRequestedUserId("lsdfé*[]!,");

        const retrieveUserController: RetrieveUserController = new RetrieveUserController();
        const userRetrievalOnPostgreSQLDatabase: UserRetrievalOnPostgreSQLDatabase = await retrieveUserRetrievalOnPostgreSQLDatabase();
        const retrieveUserInputJoiValidation: RetrieveUserInputJoiValidation = new RetrieveUserInputJoiValidation();
        const retrieveUserOutputJoiValidation: RetrieveUserOutputJoiValidation = new RetrieveUserOutputJoiValidation();

        const requestForNonExistentUser = async () => {
            await retrieveUserController.handleRetrieveUserRequest(retrieveUserRequest, userRetrievalOnPostgreSQLDatabase, retrieveUserInputJoiValidation, retrieveUserOutputJoiValidation);
        }

        await expect(requestForNonExistentUser()).rejects.toThrow(UnauthorisedActionError);
        await expect(requestForNonExistentUser()).rejects.toThrow("User ID is not alphanumerical");

        try {
            await requestForNonExistentUser();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("user_id_not_alphanumerical");
        }
    });

    test("Retrieved username can only contain letters, numbers and underscores", async() => {
        const userRetrievalOnPostgreSQLDatabase: UserRetrievalOnPostgreSQLDatabase = await retrieveUserRetrievalOnPostgreSQLDatabase();
        const retrieveUserInputJoiValidation: RetrieveUserInputJoiValidation = new RetrieveUserInputJoiValidation();
        const retrieveUserOutputJoiValidation: RetrieveUserOutputJoiValidation = new RetrieveUserOutputJoiValidation();

        await userRetrievalOnPostgreSQLDatabase.query("UPDATE application_users SET username = $1 WHERE id = $2", ["lae[asdf]*", testedUserID]);

        const retrieveUserTypeValidator = new RetrieveUserTypeValidator(new TypeValidator());
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest(retrieveUserTypeValidator);
        retrieveUserRequest.setRequestedUserId(testedUserID);

        const retrieveUserController: RetrieveUserController = new RetrieveUserController();

        const requestForUserWithInvalidUsername = async () => {
            await retrieveUserController.handleRetrieveUserRequest(retrieveUserRequest, userRetrievalOnPostgreSQLDatabase, retrieveUserInputJoiValidation, retrieveUserOutputJoiValidation);
        }

        await expect(requestForUserWithInvalidUsername()).rejects.toThrow(InvalidRetrievedValuesError);
        await expect(requestForUserWithInvalidUsername()).rejects.toThrow("Retrieved username is not valid: username can only contain letters, numbers and underscores");

        try {
            await requestForUserWithInvalidUsername();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("username_has_not_allowed_characters");
        }

        await userRetrievalOnPostgreSQLDatabase.query("UPDATE application_users SET username = $1 WHERE id = $2", [username, testedUserID]);
    });

    test("Retrieved username has to have at least 3 letters", async() => {
        const userRetrievalOnPostgreSQLDatabase: UserRetrievalOnPostgreSQLDatabase = await retrieveUserRetrievalOnPostgreSQLDatabase();
        const retrieveUserInputJoiValidation: RetrieveUserInputJoiValidation = new RetrieveUserInputJoiValidation();
        const retrieveUserOutputJoiValidation: RetrieveUserOutputJoiValidation = new RetrieveUserOutputJoiValidation();

        await userRetrievalOnPostgreSQLDatabase.query("UPDATE application_users SET username = $1 WHERE id = $2", ["123123123", testedUserID]);

        const retrieveUserTypeValidator = new RetrieveUserTypeValidator(new TypeValidator());
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest(retrieveUserTypeValidator);
        retrieveUserRequest.setRequestedUserId(testedUserID);

        const retrieveUserController: RetrieveUserController = new RetrieveUserController();

        const requestForUserWithInvalidUsername = async () => {
            await retrieveUserController.handleRetrieveUserRequest(retrieveUserRequest, userRetrievalOnPostgreSQLDatabase, retrieveUserInputJoiValidation, retrieveUserOutputJoiValidation);
        }

        await expect(requestForUserWithInvalidUsername()).rejects.toThrow(InvalidRetrievedValuesError);
        await expect(requestForUserWithInvalidUsername()).rejects.toThrow("Retrieved username is not valid: username needs to have at least 3 letters");

        try {
            await requestForUserWithInvalidUsername();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("username_does_not_have_enough_letters");
        }

        await userRetrievalOnPostgreSQLDatabase.query("UPDATE application_users SET username = $1 WHERE id = $2", [username, testedUserID]);
    });

    test("Retrieved email must be valid", async() => {
        const userRetrievalOnPostgreSQLDatabase: UserRetrievalOnPostgreSQLDatabase = await retrieveUserRetrievalOnPostgreSQLDatabase();
        const retrieveUserInputJoiValidation: RetrieveUserInputJoiValidation = new RetrieveUserInputJoiValidation();
        const retrieveUserOutputJoiValidation: RetrieveUserOutputJoiValidation = new RetrieveUserOutputJoiValidation();

        await userRetrievalOnPostgreSQLDatabase.query("UPDATE application_users SET email = $1 WHERE id = $2", ["test.wrong@bloblbo.beark13", testedUserID]);

        const retrieveUserTypeValidator = new RetrieveUserTypeValidator(new TypeValidator());
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest(retrieveUserTypeValidator);
        retrieveUserRequest.setRequestedUserId(testedUserID);

        const retrieveUserController: RetrieveUserController = new RetrieveUserController();

        const requestForUserWithInvalidEmail = async () => {
            await retrieveUserController.handleRetrieveUserRequest(retrieveUserRequest, userRetrievalOnPostgreSQLDatabase, retrieveUserInputJoiValidation, retrieveUserOutputJoiValidation);
        }

        await expect(requestForUserWithInvalidEmail()).rejects.toThrow(InvalidRetrievedValuesError);
        await expect(requestForUserWithInvalidEmail()).rejects.toThrow("Retrieved email is not valid");

        try {
            await requestForUserWithInvalidEmail();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("retrieved_email_is_invalid");
        }

        await userRetrievalOnPostgreSQLDatabase.query("UPDATE application_users SET email = $1 WHERE id = $2", ["test@mail.com", testedUserID]);
    });

    test("Retrieved first name has letters only", async() => {
        const userRetrievalOnPostgreSQLDatabase: UserRetrievalOnPostgreSQLDatabase = await retrieveUserRetrievalOnPostgreSQLDatabase();
        const retrieveUserInputJoiValidation: RetrieveUserInputJoiValidation = new RetrieveUserInputJoiValidation();
        const retrieveUserOutputJoiValidation: RetrieveUserOutputJoiValidation = new RetrieveUserOutputJoiValidation();

        await userRetrievalOnPostgreSQLDatabase.query("UPDATE application_users SET first_name = $1 WHERE id = $2", ["123324234", testedUserID]);

        const retrieveUserTypeValidator = new RetrieveUserTypeValidator(new TypeValidator());
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest(retrieveUserTypeValidator);
        retrieveUserRequest.setRequestedUserId(testedUserID);

        const retrieveUserController: RetrieveUserController = new RetrieveUserController();

        const requestForUserWithInvalidFirstName = async () => {
            await retrieveUserController.handleRetrieveUserRequest(retrieveUserRequest, userRetrievalOnPostgreSQLDatabase, retrieveUserInputJoiValidation, retrieveUserOutputJoiValidation);
        }

        await expect(requestForUserWithInvalidFirstName()).rejects.toThrow(InvalidRetrievedValuesError);
        await expect(requestForUserWithInvalidFirstName()).rejects.toThrow("Retrieved first name is not valid");

        try {
            await requestForUserWithInvalidFirstName();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("retrieved_first_name_is_invalid");
        }

        await userRetrievalOnPostgreSQLDatabase.query("UPDATE application_users SET first_name = $1 WHERE id = $2", ["Bob", testedUserID]);
    });

    test("Retrieved last name has letters only", async() => {
        const userRetrievalOnPostgreSQLDatabase: UserRetrievalOnPostgreSQLDatabase = await retrieveUserRetrievalOnPostgreSQLDatabase();
        const retrieveUserInputJoiValidation: RetrieveUserInputJoiValidation = new RetrieveUserInputJoiValidation();
        const retrieveUserOutputJoiValidation: RetrieveUserOutputJoiValidation = new RetrieveUserOutputJoiValidation();

        await userRetrievalOnPostgreSQLDatabase.query("UPDATE application_users SET last_name = $1 WHERE id = $2", ["123324234", testedUserID]);

        const retrieveUserTypeValidator = new RetrieveUserTypeValidator(new TypeValidator());
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest(retrieveUserTypeValidator);
        retrieveUserRequest.setRequestedUserId(testedUserID);

        const retrieveUserController: RetrieveUserController = new RetrieveUserController();

        const requestForUserWithInvalidLastName = async () => {
            await retrieveUserController.handleRetrieveUserRequest(retrieveUserRequest, userRetrievalOnPostgreSQLDatabase, retrieveUserInputJoiValidation, retrieveUserOutputJoiValidation);
        }

        await expect(requestForUserWithInvalidLastName()).rejects.toThrow(InvalidRetrievedValuesError);
        await expect(requestForUserWithInvalidLastName()).rejects.toThrow("Retrieved last name is not valid");

        try {
            await requestForUserWithInvalidLastName();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("retrieved_last_name_is_invalid");
        }

        await userRetrievalOnPostgreSQLDatabase.query("UPDATE application_users SET last_name = $1 WHERE id = $2", ["Bobby", testedUserID]);
    });
});