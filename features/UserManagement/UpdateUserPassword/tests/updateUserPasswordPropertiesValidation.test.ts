import {afterAll, beforeAll, describe, expect, test} from "@jest/globals";

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

import UserPasswordUpdateOnPostgreSQLDatabase from "../UpdateUserPasswordMain/database/UserPasswordUpdateOnPostgreSQLDatabase";
import UpdateUserPasswordInputJoiValidation from "../UpdateUserPasswordMain/validation/UpdateUserPasswordInputJoiValidation";
import UpdateUserPasswordRequest from "../UpdateUserPasswordController/UpdateUserPasswordRequest";
import UpdateUserPasswordController from "../UpdateUserPasswordController/UpdateUserPasswordController";
import UpdateUserPasswordTypeValidator from "../UpdateUserPasswordMain/validation/UpdateUserPasswordTypeValidator";

import TypeValidator from "../../../../services/validation/TypeValidator";
import BadRequestError from "../../../../services/errors/BadRequestError";
import UnauthorisedActionError from '../../../../services/errors/UnauthorisedActionError';

afterAll(async() => {
    const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
    await userPasswordUpdateOnPostgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await userPasswordUpdateOnPostgreSQLDatabase.close();
});

const retrieveUserPasswordUpdateOnPostgreSQLDatabase = async (): Promise<UserPasswordUpdateOnPostgreSQLDatabase> => {
    const userPasswordUpdateOnPostgreSQLDatabase = new UserPasswordUpdateOnPostgreSQLDatabase();
    await userPasswordUpdateOnPostgreSQLDatabase.connect();

    return userPasswordUpdateOnPostgreSQLDatabase;
}

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

describe("test user password update feature properties validation", () => {
    test("Cannot update a user without a user id", async () => {
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);

        const misformedRequest = () => {
            updateUserPasswordRequest.setUserId("");
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Cannot update a user's password without a user id");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("user_id_not_informed");
        }
    });

    test("Cannot update a user without a requested user id", async () => {
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);

        const misformedRequest = () => {
            updateUserPasswordRequest.setUpdatedUserId("");
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Cannot update a user's password without an updated user id");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_not_informed");
        }
    });

    test("Cannot update a user without an original password informed", async () => {
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);

        const misformedRequest = () => {
            updateUserPasswordRequest.setOrignalPassword("");
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Cannot update a user's password without an original password informed");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("original_password_not_informed");
        }
    });

    test("Cannot update a user without a changed password informed", async () => {
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);

        const misformedRequest = () => {
            updateUserPasswordRequest.setChangedPassword("");
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Cannot update a user's password without a changed password informed");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("changed_password_not_informed");
        }
    });

    test("Cannot update a user without a changed password confirmation informed", async () => {
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);

        const misformedRequest = () => {
            updateUserPasswordRequest.setChangedPasswordConfirmation("");
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Cannot update a user's password without a changed password confirmation informed");

        try {
            await misformedRequest();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("changed_password_confirmation_not_informed");
        }
    });

    test("Cannot update a user's password with a user ID that is not alphanumerical", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId("lsdfé*[]!,")
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf sdfs sdSDFdfi 1234 !")
        .setChangedPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPasswordConfirmation("Sdf sdfs sdSDFdfi 1234 !4");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updateUserPasswordRequestWithInvalidUserId = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow("User ID is not alphanumerical");

        try {
            await updateUserPasswordRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("user_id_not_alphanumerical");
        }
    });

    test("Cannot update a user's password with an updated user ID that is not alphanumerical", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId("lsdfé*[]!,")
        .setOrignalPassword("Sdf sdfs sdSDFdfi 1234 !")
        .setChangedPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPasswordConfirmation("Sdf sdfs sdSDFdfi 1234 !4");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updateUserPasswordRequestWithInvalidUserId = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow("Updated user ID is not alphanumerical");

        try {
            await updateUserPasswordRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("updated_user_id_not_alphanumerical");
        }
    });

    test("Original password should be at least 12 characters long", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf")
        .setChangedPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPasswordConfirmation("Sdf sdfs sdSDFdfi 1234 !4");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updateUserPasswordRequestWithInvalidUserId = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow("Original password must be at least 12 characters long");

        try {
            await updateUserPasswordRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("original_password_doesnt_have_12_characters");
        }
    });

    test("Original password should have at least 3 lowercase letters", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf SDFSDFSDFSDFSDFSDFSDF")
        .setChangedPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPasswordConfirmation("Sdf sdfs sdSDFdfi 1234 !4");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updateUserPasswordRequestWithInvalidUserId = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow("Original password needs to have at least 3 lowercase letters");

        try {
            await updateUserPasswordRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("original_password_doesnt_have_3_lowercase_letters");
        }
    });

    test("Original password should have at least 3 uppercase letters", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf asdfasdfasdfsdf")
        .setChangedPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPasswordConfirmation("Sdf sdfs sdSDFdfi 1234 !4");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updateUserPasswordRequestWithInvalidUserId = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow("Original password needs to have at least 3 uppercase letters");

        try {
            await updateUserPasswordRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("original_password_doesnt_have_3_uppercase_letters");
        }
    });

    test("Original password should have at least 3 symbols, special characters or space", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf aSDFSDFSDFSDFSDFsdfsdf")
        .setChangedPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPasswordConfirmation("Sdf sdfs sdSDFdfi 1234 !4");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updateUserPasswordRequestWithInvalidUserId = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow("Original password needs to have at least 3 symbols, special characters or space");

        try {
            await updateUserPasswordRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("original_password_miss_special_characters");
        }
    });

    test("Original password should have at least 3 numbers", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf aSDFSD FSDFS DFSDFs dfsdf")
        .setChangedPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPasswordConfirmation("Sdf sdfs sdSDFdfi 1234 !4");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updateUserPasswordRequestWithInvalidUserId = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow("Original password needs to have at least 3 numbers");

        try {
            await updateUserPasswordRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("original_password_doesnt_have_3_numbers");
        }
    });

    test("Changed password should be at least 12 characters long", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPassword("Sdf")
        .setChangedPasswordConfirmation("Sdf sdfs sdSDFdfi 1234 !4");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updateUserPasswordRequestWithInvalidUserId = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow("Changed password must be at least 12 characters long");

        try {
            await updateUserPasswordRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("changed_password_doesnt_have_12_characters");
        }
    });

    test("Changed password should have at least 3 lowercase letters", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPassword("Sdf SDFSDFSDFSDFSDFSDFSDF")
        .setChangedPasswordConfirmation("Sdf sdfs sdSDFdfi 1234 !4");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updateUserPasswordRequestWithInvalidUserId = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow("Changed password needs to have at least 3 lowercase letters");

        try {
            await updateUserPasswordRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("changed_password_doesnt_have_3_lowercase_letters");
        }
    });

    test("Changed password should have at least 3 uppercase letters", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPassword("Sdf asdfasdfasdfsdf")
        .setChangedPasswordConfirmation("Sdf sdfs sdSDFdfi 1234 !4");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updateUserPasswordRequestWithInvalidUserId = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow("Changed password needs to have at least 3 uppercase letters");

        try {
            await updateUserPasswordRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("changed_password_doesnt_have_3_uppercase_letters");
        }
    });

    test("Changed password should have at least 3 symbols, special characters or space", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPassword("Sdf aSDFSDFSDFSDFSDFsdfsdf")
        .setChangedPasswordConfirmation("Sdf sdfs sdSDFdfi 1234 !4");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updateUserPasswordRequestWithInvalidUserId = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow("Changed password needs to have at least 3 symbols, special characters or space");

        try {
            await updateUserPasswordRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("changed_password_miss_special_characters");
        }
    });

    test("Changed password should have at least 3 numbers", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPassword("Sdf aSDFSD FSDFS DFSDFs dfsdf")
        .setChangedPasswordConfirmation("Sdf sdfs sdSDFdfi 1234 !4");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updateUserPasswordRequestWithInvalidUserId = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow("Changed password needs to have at least 3 numbers");

        try {
            await updateUserPasswordRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("changed_password_doesnt_have_3_numbers");
        }
    });

    test("Changed password confirmation should be at least 12 characters long", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPasswordConfirmation("Sdf");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updateUserPasswordRequestWithInvalidUserId = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow("Changed password confirmation must be at least 12 characters long");

        try {
            await updateUserPasswordRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("changed_password_confirmation_doesnt_have_12_characters");
        }
    });

    test("Changed password confirmation should have at least 3 lowercase letters", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPasswordConfirmation("Sdf SDFSDFSDFSDFSDFSDFSDF");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updateUserPasswordRequestWithInvalidUserId = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow("Changed password confirmation needs to have at least 3 lowercase letters");

        try {
            await updateUserPasswordRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("changed_password_confirmation_doesnt_have_3_lowercase_letters");
        }
    });

    test("Changed password confirmation should have at least 3 uppercase letters", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPasswordConfirmation("Sdf asdfasdfasdfsdf");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updateUserPasswordRequestWithInvalidUserId = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow("Changed password confirmation needs to have at least 3 uppercase letters");

        try {
            await updateUserPasswordRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("changed_password_confirmation_doesnt_have_3_uppercase_letters");
        }
    });

    test("Changed password confirmation should have at least 3 symbols, special characters or space", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPasswordConfirmation("Sdf aSDFSDFSDFSDFSDFsdfsdf");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updateUserPasswordRequestWithInvalidUserId = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow("Changed password confirmation needs to have at least 3 symbols, special characters or space");

        try {
            await updateUserPasswordRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("changed_password_confirmation_miss_special_characters");
        }
    });

    test("Changed password confirmation should have at least 3 numbers", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPasswordConfirmation("Sdf aSDFSD FSDFS DFSDFs dfsdf");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updateUserPasswordRequestWithInvalidUserId = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserPasswordRequestWithInvalidUserId()).rejects.toThrow("Changed password confirmation needs to have at least 3 numbers");

        try {
            await updateUserPasswordRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("changed_password_confirmation_doesnt_have_3_numbers");
        }
    });
});