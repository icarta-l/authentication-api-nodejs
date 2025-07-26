import UserAuthenticationOutput from "../AuthenticateUserUseCase/UserAuthenticationOutput";
import AuthenticateUserResponse from "./AuthenticateUserResponse";

export default class AuthenticateUserPresenter
{
    private authenticateUserResponse!: AuthenticateUserResponse;

    public getAuthenticateUserResponse(): AuthenticateUserResponse
    {
        return this.authenticateUserResponse;
    }

    public retrieveUserAuthenticationOutput(userAuthenticationOutput: UserAuthenticationOutput): void
    {
        this.authenticateUserResponse = new AuthenticateUserResponse();

        this.authenticateUserResponse.setUserId(userAuthenticationOutput.getUserId());
        this.authenticateUserResponse.setWetherUserSuccessfullyLoggedIn(userAuthenticationOutput.userIsLoggedIn());
    }
}