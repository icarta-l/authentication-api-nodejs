import AuthenticateUserRequest from "./AuthenticateUserRequest";
import AuthenticateUserResponse from "./AuthenticateUserResponse";
import AuthenticateUserInput from "../AuthenticateUserUseCase/AuthenticateUserInput";
import UserAuthenticationOnPostgreSQLDatabase from "../AuthenticateUserMain/database/UserAuthenticationOnPostgreSQLDatabase";

export default class AuthenticateUserController
{
    public async handleAuthenticateUserRequest(authenticateUserRequest: AuthenticateUserRequest, userAuthenticationOnPostgreSQLDatabase: UserAuthenticationOnPostgreSQLDatabase): Promise<AuthenticateUserResponse>
    {
        const authenticateUserResponse = new AuthenticateUserResponse();

        try {
            const userID = await userAuthenticationOnPostgreSQLDatabase.authenticateUser(authenticateUserRequest.getEmail(), authenticateUserRequest.getPassword());

            if (userID) {
                authenticateUserResponse.setWetherUserSuccessfullyLoggedIn(true)
                .setUserId(userID);
            } else {
                authenticateUserResponse.setWetherUserSuccessfullyLoggedIn(false);

            }
        } catch (error) {
            authenticateUserResponse.setWetherUserSuccessfullyLoggedIn(false);
        }

        return authenticateUserResponse;
    }
}