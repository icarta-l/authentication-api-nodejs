import {afterAll, beforeAll, describe, expect, test} from "@jest/globals";

import UnauthorisedActionError from "../../../services/errors/UnauthorisedActionError";
import TypeValidator from "../../../services/validation/TypeValidator";

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
import UpdateUserInformationResponse from "../UpdateUserInformationController/UpdateUserInformationResponse";
import UpdateUserInformationInputJoiValidation from "../UpdateUserInformationMain/validation/UpdateUserInformationInputJoiValidation";
import UpdateUserInformationTypeValidator from "../UpdateUserInformationMain/validation/UpdateUserInformationTypeValidator";

import UserRetrievalOnPostgreSQLDatabase from "../../RetrieveUser/RetrieveUserMain/database/UserRetrievalOnPostgreSQLDatabase";
import RetrieveUserInputJoiValidation from "../../RetrieveUser/RetrieveUserMain/validation/RetrieveUserInputJoiValidation";
import RetrieveUserOutputJoiValidation from "../../RetrieveUser/RetrieveUserMain/validation/RetrieveUserOutputJoiValidation";
import RetrieveUserRequest from "../../RetrieveUser/RetrieveUserController/RetrieveUserRequest";
import RetrieveUserResponse from "../../RetrieveUser/RetrieveUserController/RetrieveUserResponse";
import RetrieveUserController from "../../RetrieveUser/RetrieveUserController/RetrieveUserController";
import RetrieveUserTypeValidator from "../../RetrieveUser/RetrieveUserMain/validation/RetrieveUserTypeValidator";

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

const retrieveUserRetrievalOnPostgreSQLDatabase = async (): Promise<UserRetrievalOnPostgreSQLDatabase> => {
    const userRetrievalOnPostgreSQLDatabase = new UserRetrievalOnPostgreSQLDatabase();
    await userRetrievalOnPostgreSQLDatabase.connect();
    
    return userRetrievalOnPostgreSQLDatabase;
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

describe("test user information update feature logic", () => {
    test("User can update its own user information", async () => {
        const updateUserInformationInputJoiValidation: UpdateUserInformationInputJoiValidation = new UpdateUserInformationInputJoiValidation();
        const userInformationUpdateOnPostgreSQLDatabase: UserInformationUpdateOnPostgreSQLDatabase = await retrieveUserInformationUpdateOnPostgreSQLDatabase();
        
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);
        updateUserInformationRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setFirstName("Foo")
        .setLastName("Bar");

        testedUserID = testedUserID;

        const updateUserInformationController: UpdateUserInformationController = new UpdateUserInformationController();
        const updateUserInformationResponse: UpdateUserInformationResponse = await updateUserInformationController.handleUpdateUserInformationRequest(updateUserInformationRequest, userInformationUpdateOnPostgreSQLDatabase, updateUserInformationInputJoiValidation);

        expect(updateUserInformationResponse.userInformationWereUpdated()).toBe(true);
    });

    test("User retrieved information match after update", async () => {
        const retrieveUserInputJoiValidation: RetrieveUserInputJoiValidation = new RetrieveUserInputJoiValidation();
        const retrieveUserOutputJoiValidation: RetrieveUserOutputJoiValidation = new RetrieveUserOutputJoiValidation();

        const userRetrievalOnPostgreSQLDatabase: UserRetrievalOnPostgreSQLDatabase = await retrieveUserRetrievalOnPostgreSQLDatabase();
        
        const retrieveUserTypeValidator = new RetrieveUserTypeValidator(new TypeValidator());
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest(retrieveUserTypeValidator);
        retrieveUserRequest.setRequestedUserId(testedUserID);

        const retrieveUserController: RetrieveUserController = new RetrieveUserController();
        const retrieveUserResponse: RetrieveUserResponse = await retrieveUserController.handleRetrieveUserRequest(retrieveUserRequest, userRetrievalOnPostgreSQLDatabase, retrieveUserInputJoiValidation, retrieveUserOutputJoiValidation);

        expect(retrieveUserResponse.getUsername()).toBe("user");
        expect(retrieveUserResponse.getEmail()).toBe("test@mail.com");
        expect(retrieveUserResponse.getFirstName()).toBe("Foo");
        expect(retrieveUserResponse.getLastName()).toBe("Bar");
        expect(retrieveUserResponse.getUserId()).toBe(testedUserID);
    });

    test("Cannot update a user if user role is not recognised", async () => {
        const userInformationUpdateOnPostgreSQLDatabase: UserInformationUpdateOnPostgreSQLDatabase = await retrieveUserInformationUpdateOnPostgreSQLDatabase();
        const updateUserInformationInputJoiValidation: UpdateUserInformationInputJoiValidation = new UpdateUserInformationInputJoiValidation(); 

        await userInformationUpdateOnPostgreSQLDatabase.query("UPDATE application_users SET role = 'sdfasdfasd' WHERE id = $1", [testedUserID]);
        
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);
        updateUserInformationRequest.setUserId(testedUserID)
        .setUpdatedUserId(testedUserID)
        .setFirstName("Foo")
        .setLastName("Bar");

        const updateUserInformationController: UpdateUserInformationController = new UpdateUserInformationController();

        const updateUserRequestWhileUserRoleIsNotRecognised = async () => {
            await updateUserInformationController.handleUpdateUserInformationRequest(updateUserInformationRequest, userInformationUpdateOnPostgreSQLDatabase, updateUserInformationInputJoiValidation);
        }

        await expect(updateUserRequestWhileUserRoleIsNotRecognised()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserRequestWhileUserRoleIsNotRecognised()).rejects.toThrow("User role was not recognised");

        try {
            await updateUserRequestWhileUserRoleIsNotRecognised();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("user_role_not_recognised");
        }

        await userInformationUpdateOnPostgreSQLDatabase.query("UPDATE application_users SET role = 'USER_ROLE' WHERE id = $1", [testedUserID]);
    });

    test("Cannot update another user", async () => {
        const userInformationUpdateOnPostgreSQLDatabase: UserInformationUpdateOnPostgreSQLDatabase = await retrieveUserInformationUpdateOnPostgreSQLDatabase();
        const updateUserInformationInputJoiValidation: UpdateUserInformationInputJoiValidation = new UpdateUserInformationInputJoiValidation(); 
        const updateUserInformationTypeValidator = new UpdateUserInformationTypeValidator(new TypeValidator());
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest(updateUserInformationTypeValidator);
        updateUserInformationRequest.setUserId(testedUserID)
        .setUpdatedUserId("1234")
        .setFirstName("Foo")
        .setLastName("Bar");

        const updateUserInformationController: UpdateUserInformationController = new UpdateUserInformationController();

        const updateUserRequestWithInvalidUserId = async () => {
            await updateUserInformationController.handleUpdateUserInformationRequest(updateUserInformationRequest, userInformationUpdateOnPostgreSQLDatabase, updateUserInformationInputJoiValidation);
        }

        await expect(updateUserRequestWithInvalidUserId()).rejects.toThrow(UnauthorisedActionError);
        await expect(updateUserRequestWithInvalidUserId()).rejects.toThrow("Cannot update another user");

        try {
            await updateUserRequestWithInvalidUserId();
        } catch(error: any) {
            expect(error.getErrorCode()).toBe("cannot_update_another_user");
        }
    });
});