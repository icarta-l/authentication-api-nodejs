import AuthenticateUserRequest from "./AuthenticateUserRequest";
import AuthenticateUserResponse from "./AuthenticateUserResponse";
import UserAuthenticationOnPostgreSQLDatabase from "../AuthenticateUserMain/database/UserAuthenticationOnPostgreSQLDatabase";

export default class AuthenticateUserController
{
    public handleAuthenticateUserRequest(authenticateUserRequest: AuthenticateUserRequest, userAuthenticationOnPostgreSQLDatabase: UserAuthenticationOnPostgreSQLDatabase): AuthenticateUserResponse
    {
        const authenticateUserResponse = new AuthenticateUserResponse();
        return authenticateUserResponse;
    }
}