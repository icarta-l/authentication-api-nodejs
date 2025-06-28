import AuthenticateUserRequest from "./AuthenticateUserRequest";
import AuthenticateUserResponse from "./AuthenticateUserResponse";
import AuthenticateUserInput from "../AuthenticateUserUseCase/AuthenticateUserInput";
import UserAuthenticationOnPostgreSQLDatabase from "../AuthenticateUserMain/database/UserAuthenticationOnPostgreSQLDatabase";

export default class AuthenticateUserController
{
    public async handleAuthenticateUserRequest(authenticateUserRequest: AuthenticateUserRequest, userAuthenticationOnPostgreSQLDatabase: UserAuthenticationOnPostgreSQLDatabase): Promise<AuthenticateUserResponse>
    {
        const authenticateUserResponse = new AuthenticateUserResponse();

        console.log("Here!");

        try {
            const isAuthenticated = await userAuthenticationOnPostgreSQLDatabase.authenticateUser(authenticateUserRequest.getEmail(), authenticateUserRequest.getPassword());
            authenticateUserResponse.setWetherUserSuccessfullyLoggedIn(isAuthenticated);
        } catch (error) {
            authenticateUserResponse.setWetherUserSuccessfullyLoggedIn(false);
        }

        console.log("authenticateUserResponse", authenticateUserResponse);

        return authenticateUserResponse;
    }
}