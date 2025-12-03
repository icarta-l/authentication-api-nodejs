import {afterAll, describe, expect, test} from "@jest/globals";

import BadRequestError from "../../../services/errors/BadRequestError";
import UnauthorisedActionError from "../../../services/errors/UnauthorisedActionError";

import UserRegistrationOnPostgreSQLDatabase from "../../RegisterUser/RegisterUserMain/database/UserRegistrationOnPostgreSQLDatabase";
import RegisterUserController from "../../RegisterUser/RegisterUserController/RegisterUserController";
import RegisterUserRequest from "../../RegisterUser/RegisterUserController/RegisterUserRequest";
import type RegisterUserResponse from "../../RegisterUser/RegisterUserController/RegisterUserResponse";
import RegisterUserJoiValidation from "../../RegisterUser/RegisterUserMain/validation/RegisterUserJoiValidation";

import UserAuthenticationOnPostgreSQLDatabase from "../../AuthenticateUser/AuthenticateUserMain/database/UserAuthenticationOnPostgreSQLDatabase";
import AuthenticateUserController from "../../AuthenticateUser/AuthenticateUserController/AuthenticateUserController";
import AuthenticateUserRequest from "../../AuthenticateUser/AuthenticateUserController/AuthenticateUserRequest";
import type AuthenticateUserResponse from "../../AuthenticateUser/AuthenticateUserController/AuthenticateUserResponse";
import AuthenticationUserJoiValidation from "../../AuthenticateUser/AuthenticateUserMain/validation/AuthenticateUserJoiValidation";

import UserInformationUpdateOnPostgreSQLDatabase from "../UpdateUserInformationMain/database/UserInformationUpdateOnPostgreSQLDatabase";
import UpdateUserInformationRequest from "../UpdateUserInformationController/UpdateUserInformationRequest";
import UpdateUserInformationController from "../UpdateUserInformationController/UpdateUserInformationController";
import UpdateUserInformationResponse from "../UpdateUserInformationController/UpdateUserInformationResponse";
import UpdateUserInformationInputJoiValidation from "../UpdateUserInformationMain/validation/UpdateUserInformationInputJoiValidation";

import UserRetrievalOnPostgreSQLDatabase from "../../RetrieveUser/RetrieveUserMain/database/UserRetrievalOnPostgreSQLDatabase";
import RetrieveUserInputJoiValidation from "../../RetrieveUser/RetrieveUserMain/validation/RetrieveUserInputJoiValidation";
import RetrieveUserOutputJoiValidation from "../../RetrieveUser/RetrieveUserMain/validation/RetrieveUserOutputJoiValidation";
import RetrieveUserRequest from "../../RetrieveUser/RetrieveUserController/RetrieveUserRequest";
import RetrieveUserResponse from "../../RetrieveUser/RetrieveUserController/RetrieveUserResponse";
import RetrieveUserController from "../../RetrieveUser/RetrieveUserController/RetrieveUserController";

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

describe("test user information update feature", () => {
    test("User can update its own user information", async () => {
        const userRegistrationOnPostgreSQLDatabase: UserRegistrationOnPostgreSQLDatabase = await retrieveUserRegistrationOnPostgreSQLDatabase();
        const registerUserJoiValidation: RegisterUserJoiValidation = new RegisterUserJoiValidation();
        const authenticationUserJoiValidation: AuthenticationUserJoiValidation = new AuthenticationUserJoiValidation();
        const updateUserInformationInputJoiValidation: UpdateUserInformationInputJoiValidation = new UpdateUserInformationInputJoiValidation();

        const registerUserRequest: RegisterUserRequest = new RegisterUserRequest();
            registerUserRequest.setUsername("user")
            .setEmail("test@mail.com")
            .setPassword("Sdf sdfs sdSDFdfi 1234 !")
            .setFirstName("Bob")
            .setLastName("Bobby");

        const registerUserController: RegisterUserController = new RegisterUserController();
        const registerUserResponse: RegisterUserResponse = await registerUserController.handleRegisterUserRequest(registerUserRequest, userRegistrationOnPostgreSQLDatabase, registerUserJoiValidation);

        expect(registerUserResponse.userIsRegistered()).toBe(true);

        const userAuthenticationOnPostgreSQLDatabase: UserAuthenticationOnPostgreSQLDatabase = await retrieveUserAuthenticationOnPostgreSQLDatabase();
                
        const authenticateUserRequest: AuthenticateUserRequest = new AuthenticateUserRequest();
        authenticateUserRequest.setEmail("test@mail.com")
        .setPassword("Sdf sdfs sdSDFdfi 1234 !");

        const authenticateUserController: AuthenticateUserController = new AuthenticateUserController();
        const authenticateUserResponse: AuthenticateUserResponse = await authenticateUserController.handleAuthenticateUserRequest(authenticateUserRequest, userAuthenticationOnPostgreSQLDatabase, authenticationUserJoiValidation);

        expect(authenticateUserResponse.userIsLoggedIn()).toBe(true);
        expect(authenticateUserResponse.getUserId().length).toBeGreaterThan(0);

        const userInformationUpdateOnPostgreSQLDatabase: UserInformationUpdateOnPostgreSQLDatabase = await retrieveUserInformationUpdateOnPostgreSQLDatabase();
        
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest();
        updateUserInformationRequest.setUserId(authenticateUserResponse.getUserId())
        .setUpdatedUserId(authenticateUserResponse.getUserId())
        .setFirstName("Foo")
        .setLastName("Bar");

        testedUserID = authenticateUserResponse.getUserId();

        const updateUserInformationController: UpdateUserInformationController = new UpdateUserInformationController();
        const updateUserInformationResponse: UpdateUserInformationResponse = await updateUserInformationController.handleUpdateUserInformationRequest(updateUserInformationRequest, userInformationUpdateOnPostgreSQLDatabase, updateUserInformationInputJoiValidation);

        expect(updateUserInformationResponse.userInformationWereUpdated()).toBe(true);
    });

    test("User retrieved information match after update", async () => {
        const retrieveUserInputJoiValidation: RetrieveUserInputJoiValidation = new RetrieveUserInputJoiValidation();
        const retrieveUserOutputJoiValidation: RetrieveUserOutputJoiValidation = new RetrieveUserOutputJoiValidation();

        const userRetrievalOnPostgreSQLDatabase: UserRetrievalOnPostgreSQLDatabase = await retrieveUserRetrievalOnPostgreSQLDatabase();
        
        const retrieveUserRequest: RetrieveUserRequest = new RetrieveUserRequest();
        retrieveUserRequest.setRequestedUserId(testedUserID);

        const retrieveUserController: RetrieveUserController = new RetrieveUserController();
        const retrieveUserResponse: RetrieveUserResponse = await retrieveUserController.handleRetrieveUserRequest(retrieveUserRequest, userRetrievalOnPostgreSQLDatabase, retrieveUserInputJoiValidation, retrieveUserOutputJoiValidation);

        expect(retrieveUserResponse.getUsername()).toBe("user");
        expect(retrieveUserResponse.getEmail()).toBe("test@mail.com");
        expect(retrieveUserResponse.getFirstName()).toBe("Foo");
        expect(retrieveUserResponse.getLastName()).toBe("Bar");
        expect(retrieveUserResponse.getUserId()).toBe(testedUserID);
    });

    test("Cannot update a user without a user id", async () => {
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest();

        const misformedRequest = () => {
            updateUserInformationRequest.setUserId("");
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Cannot update a user without a user id");
    });

    test("Cannot update a user without a requested user id", async () => {
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest();

        const misformedRequest = () => {
            updateUserInformationRequest.setUpdatedUserId("");
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Cannot update a user without an updated user id");
    });

    test("Cannot update a user without a first name", async () => {
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest();

        const misformedRequest = () => {
            updateUserInformationRequest.setFirstName("");
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Cannot update a user without a first name");
    });

    test("Cannot update a user without a last name", async () => {
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest();

        const misformedRequest = () => {
            updateUserInformationRequest.setLastName("");
        }

        expect(misformedRequest).toThrow(BadRequestError);
        expect(misformedRequest).toThrow("Cannot update a user without a last name");
    });

    test("Cannot update a user if user role is not recognised", async () => {
        const userInformationUpdateOnPostgreSQLDatabase: UserInformationUpdateOnPostgreSQLDatabase = await retrieveUserInformationUpdateOnPostgreSQLDatabase();
        const updateUserInformationInputJoiValidation: UpdateUserInformationInputJoiValidation = new UpdateUserInformationInputJoiValidation(); 

        await userInformationUpdateOnPostgreSQLDatabase.query("UPDATE application_users SET role = 'sdfasdfasd' WHERE id = $1", [testedUserID]);
        
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest();
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

        await userInformationUpdateOnPostgreSQLDatabase.query("UPDATE application_users SET role = 'USER_ROLE' WHERE id = $1", [testedUserID]);
    });

    test("Cannot update a user with a user ID that is not alphanumerical", async () => {
        const userInformationUpdateOnPostgreSQLDatabase: UserInformationUpdateOnPostgreSQLDatabase = await retrieveUserInformationUpdateOnPostgreSQLDatabase();
        const updateUserInformationInputJoiValidation: UpdateUserInformationInputJoiValidation = new UpdateUserInformationInputJoiValidation(); 
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest();
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
    });

    test("Cannot update a user with an updated user ID that is not alphanumerical", async () => {
        const userInformationUpdateOnPostgreSQLDatabase: UserInformationUpdateOnPostgreSQLDatabase = await retrieveUserInformationUpdateOnPostgreSQLDatabase();
        const updateUserInformationInputJoiValidation: UpdateUserInformationInputJoiValidation = new UpdateUserInformationInputJoiValidation(); 
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest();
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
    });

    test("Cannot update another user", async () => {
        const userInformationUpdateOnPostgreSQLDatabase: UserInformationUpdateOnPostgreSQLDatabase = await retrieveUserInformationUpdateOnPostgreSQLDatabase();
        const updateUserInformationInputJoiValidation: UpdateUserInformationInputJoiValidation = new UpdateUserInformationInputJoiValidation(); 
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest();
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
    });

    test("Cannot update a user with a first name that has non-letters characters", async () => {
        const userInformationUpdateOnPostgreSQLDatabase: UserInformationUpdateOnPostgreSQLDatabase = await retrieveUserInformationUpdateOnPostgreSQLDatabase();
        const updateUserInformationInputJoiValidation: UpdateUserInformationInputJoiValidation = new UpdateUserInformationInputJoiValidation(); 
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest();
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
    });

    test("Cannot update a user with a last name that has non-letters characters", async () => {
        const userInformationUpdateOnPostgreSQLDatabase: UserInformationUpdateOnPostgreSQLDatabase = await retrieveUserInformationUpdateOnPostgreSQLDatabase();
        const updateUserInformationInputJoiValidation: UpdateUserInformationInputJoiValidation = new UpdateUserInformationInputJoiValidation(); 
        const updateUserInformationRequest: UpdateUserInformationRequest = new UpdateUserInformationRequest();
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
    });
});