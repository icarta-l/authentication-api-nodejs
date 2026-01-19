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

import UserPasswordUpdateOnPostgreSQLDatabase from "../UpdateUserPasswordMain/database/UserPasswordUpdateOnPostgreSQLDatabase";
import UpdateUserPasswordInputJoiValidation from "../UpdateUserPasswordMain/validation/UpdateUserPasswordInputJoiValidation";
import UpdateUserPasswordRequest from "../UpdateUserPasswordController/UpdateUserPasswordRequest";
import UpdateUserPasswordController from "../UpdateUserPasswordController/UpdateUserPasswordController";
import UpdateUserPasswordResponse from "../UpdateUserPasswordController/UpdateUserPasswordResponse";
import UpdateUserPasswordTypeValidator from "../UpdateUserPasswordMain/validation/UpdateUserPasswordTypeValidator";

import TypeValidator from "../../../services/validation/TypeValidator";

import UnauthorisedActionError from '../../../services/errors/UnauthorisedActionError';

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

describe("test user password update feature logic", () => {
    test("User can update its own password", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
                
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf sdfs sdSDFdfi 1234 !")
        .setChangedPassword("Sdf sdfs sdSDFdfi 1234 !2")
        .setChangedPasswordConfirmation("Sdf sdfs sdSDFdfi 1234 !2");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();
        const updateUserPasswordResponse: UpdateUserPasswordResponse = await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);

        expect(updateUserPasswordResponse.userPasswordWasUpdated()).toBe(true);
    });

    test("User can log in with its changed password", async () => {
        const authenticationUserJoiValidation: AuthenticationUserJoiValidation = new AuthenticationUserJoiValidation();
        const userAuthenticationOnPostgreSQLDatabase: UserAuthenticationOnPostgreSQLDatabase = await retrieveUserAuthenticationOnPostgreSQLDatabase();
        
        const authenticateUserTypeValidator = new AuthenticateUserTypeValidator(new TypeValidator());
        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest(authenticateUserTypeValidator);
        authenticateUserRequest.setEmail("test@mail.com")
        .setPassword("Sdf sdfs sdSDFdfi 1234 !2");

        const authenticateUserController: AuthenticateUserController = new AuthenticateUserController();
        const authenticateUserResponse: AuthenticateUserResponse = await authenticateUserController.handleAuthenticateUserRequest(authenticateUserRequest, userAuthenticationOnPostgreSQLDatabase, authenticationUserJoiValidation);

        expect(authenticateUserResponse.userIsLoggedIn()).toBe(true);
    });

    test("User cannot log in with its original password", async () => {
        const authenticationUserJoiValidation: AuthenticationUserJoiValidation = new AuthenticationUserJoiValidation();
        const userAuthenticationOnPostgreSQLDatabase: UserAuthenticationOnPostgreSQLDatabase = await retrieveUserAuthenticationOnPostgreSQLDatabase();
        
        const authenticateUserTypeValidator = new AuthenticateUserTypeValidator(new TypeValidator());
        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest(authenticateUserTypeValidator);
        authenticateUserRequest.setEmail("test@mail.com")
        .setPassword("Sdf sdfs sdSDFdfi 1234 !");

        const authenticateUserController: AuthenticateUserController = new AuthenticateUserController();
        const authenticateUserResponse: AuthenticateUserResponse = await authenticateUserController.handleAuthenticateUserRequest(authenticateUserRequest, userAuthenticationOnPostgreSQLDatabase, authenticationUserJoiValidation);

        expect(authenticateUserResponse.userIsLoggedIn()).toBe(false);
    });

    test("User cannot update its own password if original password doesn't match", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
                
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf sdfs sdSDFdfi 1234 !")
        .setChangedPassword("Sdf sdfs sdSDFdfi 1234 !2")
        .setChangedPasswordConfirmation("Sdf sdfs sdSDFdfi 1234 !2");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const passwordUpdateWithWrongOriginalPassword = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(passwordUpdateWithWrongOriginalPassword()).rejects.toThrow(UnauthorisedActionError);
        await expect(passwordUpdateWithWrongOriginalPassword()).rejects.toThrow("Original password is not recognised");

        try {
            await passwordUpdateWithWrongOriginalPassword();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("original_password_not_recognised");
        }
    });

    test("User cannot update its own password if changed password and changed password confirmation do not match", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
                
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf sdfs sdSDFdfi 1234 !2")
        .setChangedPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPasswordConfirmation("Sdf sdfs sdSDFdfi 1234 !3");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const passwordUpdateWithWrongOriginalPassword = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(passwordUpdateWithWrongOriginalPassword()).rejects.toThrow(UnauthorisedActionError);
        await expect(passwordUpdateWithWrongOriginalPassword()).rejects.toThrow("Changed password and confirmation do not match");

        try {
            await passwordUpdateWithWrongOriginalPassword();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("changed_password_and_confirmation_do_not_match");
        }
    });

    test("User original password and changed password must be different", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
                
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf sdfs sdSDFdfi 1234 !2")
        .setChangedPassword("Sdf sdfs sdSDFdfi 1234 !2")
        .setChangedPasswordConfirmation("Sdf sdfs sdSDFdfi 1234 !2");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const passwordUpdateWithWrongOriginalPassword = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(passwordUpdateWithWrongOriginalPassword()).rejects.toThrow(UnauthorisedActionError);
        await expect(passwordUpdateWithWrongOriginalPassword()).rejects.toThrow("Original password and changed password are identical");

        try {
            await passwordUpdateWithWrongOriginalPassword();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("original_password_and_changed_password_identical");
        }
    });

    test("Cannot update a user password if user role is not recognised", async () => {
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();

        await userPasswordUpdateOnPostgreSQLDatabase.query("UPDATE application_users SET role = 'sdfasdfasd' WHERE id = $1", [testedUserID]);
        
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setOrignalPassword("Sdf sdfs sdSDFdfi 1234 !")
        .setChangedPassword("Sdf sdfs sdSDFdfi 1234 !2")
        .setChangedPasswordConfirmation("Sdf sdfs sdSDFdfi 1234 !2");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updatePasswordWithWrongUserRole = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updatePasswordWithWrongUserRole()).rejects.toThrow(UnauthorisedActionError);
        await expect(updatePasswordWithWrongUserRole()).rejects.toThrow("User role was not recognised");

        try {
            await updatePasswordWithWrongUserRole();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("user_role_not_recognised");
        }

        await userPasswordUpdateOnPostgreSQLDatabase.query("UPDATE application_users SET role = 'USER_ROLE' WHERE id = $1", [testedUserID]);
    });

    test("Cannot update another user's password", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();

        const registerUserTypeValidator = new RegisterUserTypeValidator(new TypeValidator());
        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest(registerUserTypeValidator);
            registerUserRequest.setUsername("user2")
            .setEmail("test2@mail.com")
            .setPassword("Sdf sdfs sdSDFdfi 1234 !")
            .setFirstName("Bob")
            .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();
        const registerUserResponse: RegisterUserResponse = await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);

        expect(registerUserResponse.userIsRegistered()).toBe(true);

        const userAuthenticationOnPostgreSQLDatabase: UserAuthenticationOnPostgreSQLDatabase = await retrieveUserAuthenticationOnPostgreSQLDatabase();
        const authenticationUserJoiValidation: AuthenticationUserJoiValidation = new AuthenticationUserJoiValidation();
                
        const authenticateUserTypeValidator = new AuthenticateUserTypeValidator(new TypeValidator());
        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest(authenticateUserTypeValidator);
        authenticateUserRequest.setEmail("test2@mail.com")
        .setPassword("Sdf sdfs sdSDFdfi 1234 !");

        const authenticateUserController: AuthenticateUserController = new AuthenticateUserController();
        const authenticateUserResponse: AuthenticateUserResponse = await authenticateUserController.handleAuthenticateUserRequest(authenticateUserRequest, userAuthenticationOnPostgreSQLDatabase, authenticationUserJoiValidation);

        expect(authenticateUserResponse.userIsLoggedIn()).toBe(true);
        expect(authenticateUserResponse.getUserId().length).toBeGreaterThan(0);
        
        const userPasswordUpdateOnPostgreSQLDatabase: UserPasswordUpdateOnPostgreSQLDatabase = await retrieveUserPasswordUpdateOnPostgreSQLDatabase();
        const updateUserPasswordInputJoiValidation: UpdateUserPasswordInputJoiValidation = new UpdateUserPasswordInputJoiValidation();
        
        const updateUserPasswordTypeValidator = new UpdateUserPasswordTypeValidator(new TypeValidator());
        const updateUserPasswordRequest: UpdateUserPasswordRequest = new UpdateUserPasswordRequest(updateUserPasswordTypeValidator);
        updateUserPasswordRequest.setUserId(testedUserID)
        .setUpdatedUserId(authenticateUserResponse.getUserId())
        .setOrignalPassword("Sdf sdfs sdSDFdfi 1234 !")
        .setChangedPassword("Sdf sdfs sdSDFdfi 1234 !4")
        .setChangedPasswordConfirmation("Sdf sdfs sdSDFdfi 1234 !4");

        const updateUserPasswordController: UpdateUserPasswordController = new UpdateUserPasswordController();

        const updatePasswordWithWrongUserRole = async () => {
            await updateUserPasswordController.handleUpdateUserPasswordRequest(updateUserPasswordRequest, userPasswordUpdateOnPostgreSQLDatabase, updateUserPasswordInputJoiValidation);
        }

        await expect(updatePasswordWithWrongUserRole()).rejects.toThrow(UnauthorisedActionError);
        await expect(updatePasswordWithWrongUserRole()).rejects.toThrow("Cannot update another user's password");

        try {
            await updatePasswordWithWrongUserRole();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("cannot_update_another_user_s_password");
        }
    });
});