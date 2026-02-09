import {afterAll, beforeAll, describe, expect, test} from "@jest/globals";

import BadRequestError from "../../../../services/errors/BadRequestError";
import UnauthorisedActionError from "../../../../services/errors/UnauthorisedActionError";
import TypeValidator from "../../../../services/validation/TypeValidator";

import UserRegistrationOnPostgreSQLDatabase from "../../RegisterUser/RegisterUserMain/database/UserRegistrationOnPostgreSQLDatabase";
import RegisterUserController from "../../RegisterUser/RegisterUserController/RegisterUserController";
import RegisterUserRequest from "../../RegisterUser/RegisterUserController/RegisterUserRequest";
import RegisterUserJoiValidation from "../../RegisterUser/RegisterUserMain/validation/RegisterUserJoiValidation";
import RegisterUserTypeValidator from "../../RegisterUser/RegisterUserMain/validation/RegisterUserTypeValidator";

import UserAuthenticationOnPostgreSQLDatabase from "../../AuthenticateUser/AuthenticateUserMain/database/UserAuthenticationOnPostgreSQLDatabase";
import AuthenticateUserController from "../../AuthenticateUser/AuthenticateUserController/AuthenticateUserController";
import AuthenticateUserRequest from "../../AuthenticateUser/AuthenticateUserController/AuthenticateUserRequest";
import type AuthenticateUserResponse from "../../AuthenticateUser/AuthenticateUserController/AuthenticateUserResponse";
import AuthenticationUserJoiValidation from "../../AuthenticateUser/AuthenticateUserMain/validation/AuthenticateUserJoiValidation";
import AuthenticateUserTypeValidator from "../../AuthenticateUser/AuthenticateUserMain/validation/AuthenticateUserTypeValidator";

import UserInformationUpdateOnPostgreSQLDatabase from "../UpdateUserInformationMain/database/UserInformationUpdateOnPostgreSQLDatabase";
import UpdateUserInformationRequest from "../UpdateUserInformationController/UpdateUserInformationRequest";
import UpdateUserInformationController from "../UpdateUserInformationController/UpdateUserInformationController";
import UpdateUserInformationInputJoiValidation from "../UpdateUserInformationMain/validation/UpdateUserInformationInputJoiValidation";
import UpdateUserInformationTypeValidator from "../UpdateUserInformationMain/validation/UpdateUserInformationTypeValidator";

afterAll(async() => {
    const userInformationUpdateOnPostgreSQLDatabase: UserInformationUpdateOnPostgreSQLDatabase = await retrieveUserInformationUpdateOnPostgreSQLDatabase();
    await userInformationUpdateOnPostgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await userInformationUpdateOnPostgreSQLDatabase.close();
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

const retrieveUserInformationUpdateOnPostgreSQLDatabase = async (): Promise<UserInformationUpdateOnPostgreSQLDatabase> => {
    const userInformationUpdateOnPostgreSQLDatabase = new UserInformationUpdateOnPostgreSQLDatabase();
    await userInformationUpdateOnPostgreSQLDatabase.connect();

    return userInformationUpdateOnPostgreSQLDatabase;
}

let testedUserID!: string;

beforeAll(async() => {
    const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
    const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();
    const authenticationUserJoiValidation: AuthenticationUserJoiValidation = new AuthenticationUserJoiValidation();

    const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
    const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);
        registerUserRequest.setUsername("user")
        .setEmail("test@mail.com")
        .setPassword("Sdf sdfs sdSDFdfi 1234 !")
        .setFirstName("Bob")
        .setLastName("Bobby");

    const registerUserController: RegisterUserController = new RegisterUserController();
    await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);

    const userAuthenticationOnPostgreSQLDatabase: UserAuthenticationOnPostgreSQLDatabase = await retrieveUserAuthenticationOnPostgreSQLDatabase();
            
    const authenticateUserTypeValidator = new AuthenticateUserTypeValidator(new TypeValidator());
    const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest(authenticateUserTypeValidator);
    authenticateUserRequest.setEmail("test@mail.com")
    .setPassword("Sdf sdfs sdSDFdfi 1234 !");

    const authenticateUserController: AuthenticateUserController = new AuthenticateUserController();
    const authenticateUserResponse: AuthenticateUserResponse = await authenticateUserController.handleAuthenticateUserRequest(authenticateUserRequest, userAuthenticationOnPostgreSQLDatabase, authenticationUserJoiValidation);

    testedUserID = authenticateUserResponse.getUserId();
});

describe("test user information update feature properties validation", () => {
    test("Cannot update a user without a user id", async () => {
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);

        const misformedRequest = () => {
            updateUserInformationRequest.setUserId("");
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Cannot update a user without a user id");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("user_id_not_informed");
        }
    });

    test("Cannot update a user without a requested user id", async () => {
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);

        const misformedRequest = () => {
            updateUserInformationRequest.setUpdatedUserId("");
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Cannot update a user without an updated user id");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_not_informed");
        }
    });

    test("Cannot update a user without a first name", async () => {
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);

        const misformedRequest = () => {
            updateUserInformationRequest.setFirstName("");
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Cannot update a user without a first name");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("first_name_not_informed");
        }
    });

    test("Cannot update a user without a last name", async () => {
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);

        const misformedRequest = () => {
            updateUserInformationRequest.setLastName("");
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Cannot update a user without a last name");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("last_name_not_informed");
        }
    });

    test("Cannot update a user with a user ID that is not alphanumerical", async () => {
        const userInformationUpdateOnPostgreSQLDatabase: UserInformationUpdateOnPostgreSQLDatabase = await retrieveUserInformationUpdateOnPostgreSQLDatabase();
        const updateUserInformationInputJoiValidation: UpdateUserInformationInputJoiValidation = new UpdateUserInformationInputJoiValidation();
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);
        updateUserInformationRequest.setUserId("lsdfé*[]!,")
        .setUpdatedUserId(testedUserID)
        .setFirstName("Foo")
        .setLastName("Bar");

        const updateUserInformationController: UpdateUserInformationController = new UpdateUserInformationController();

        const updateUserRequestWithInvalidUserId = async () => {
            await updateUserInformationController.handleUpdateUserInformationRequest(updateUserInformationRequest, userInformationUpdateOnPostgreSQLDatabase, updateUserInformationInputJoiValidation);
        }

        await expect(updateUserRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserRequestWithInvalidUserId()).rejects.toThrow("User ID is not alphanumerical");

        try {
            await updateUserRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("user_id_not_alphanumerical");
        }
    });

    test("Cannot update a user with an updated user ID that is not alphanumerical", async () => {
        const userInformationUpdateOnPostgreSQLDatabase: UserInformationUpdateOnPostgreSQLDatabase = await retrieveUserInformationUpdateOnPostgreSQLDatabase();
        const updateUserInformationInputJoiValidation: UpdateUserInformationInputJoiValidation = new UpdateUserInformationInputJoiValidation(); 
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);
        updateUserInformationRequest.setUserId(testedUserID)
        .setUpdatedUserId("lsdfé*[]!,")
        .setFirstName("Foo")
        .setLastName("Bar");

        const updateUserInformationController: UpdateUserInformationController = new UpdateUserInformationController();

        const updateUserRequestWithInvalidUserId = async () => {
            await updateUserInformationController.handleUpdateUserInformationRequest(updateUserInformationRequest, userInformationUpdateOnPostgreSQLDatabase, updateUserInformationInputJoiValidation);
        }

        await expect(updateUserRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserRequestWithInvalidUserId()).rejects.toThrow("Updated User ID is not alphanumerical");

        try {
            await updateUserRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_not_alphanumerical");
        }
    });

    test("Cannot update a user with a first name that has non-letters characters", async () => {
        const userInformationUpdateOnPostgreSQLDatabase: UserInformationUpdateOnPostgreSQLDatabase = await retrieveUserInformationUpdateOnPostgreSQLDatabase();
        const updateUserInformationInputJoiValidation: UpdateUserInformationInputJoiValidation = new UpdateUserInformationInputJoiValidation(); 
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);
        updateUserInformationRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setFirstName("Foo_123")
        .setLastName("Bar");

        const updateUserInformationController: UpdateUserInformationController = new UpdateUserInformationController();

        const updateUserRequestWithInvalidFirstName = async () => {
            await updateUserInformationController.handleUpdateUserInformationRequest(updateUserInformationRequest, userInformationUpdateOnPostgreSQLDatabase, updateUserInformationInputJoiValidation);
        }

        await expect(updateUserRequestWithInvalidFirstName()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserRequestWithInvalidFirstName()).rejects.toThrow("First name must be letters only");

        try {
            await updateUserRequestWithInvalidFirstName();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("first_name_not_letters_only");
        }
    });

    test("Cannot update a user with a last name that has non-letters characters", async () => {
        const userInformationUpdateOnPostgreSQLDatabase: UserInformationUpdateOnPostgreSQLDatabase = await retrieveUserInformationUpdateOnPostgreSQLDatabase();
        const updateUserInformationInputJoiValidation: UpdateUserInformationInputJoiValidation = new UpdateUserInformationInputJoiValidation(); 
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);
        updateUserInformationRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setFirstName("Foo")
        .setLastName("Bar_123");

        const updateUserInformationController: UpdateUserInformationController = new UpdateUserInformationController();

        const updateUserRequestWithInvalidFirstName = async () => {
            await updateUserInformationController.handleUpdateUserInformationRequest(updateUserInformationRequest, userInformationUpdateOnPostgreSQLDatabase, updateUserInformationInputJoiValidation);
        }

        await expect(updateUserRequestWithInvalidFirstName()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserRequestWithInvalidFirstName()).rejects.toThrow("Last name must be letters only");

        try {
            await updateUserRequestWithInvalidFirstName();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("last_name_not_letters_only");
        }
    });
});