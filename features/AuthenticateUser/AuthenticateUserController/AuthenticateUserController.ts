import AuthenticateUserRequest from "./AuthenticateUserRequest";
import AuthenticateUserResponse from "./AuthenticateUserResponse";
import AuthenticateUserPresenter from "./AuthenticateUserPresenter";
import AuthenticateUserInput from "../AuthenticateUserUseCase/AuthenticateUserInput";
import UserAuthenticationInput from "../AuthenticateUserUseCase/UserAuthenticationInput";
import AuthenticateUserUseCase from "../AuthenticateUserUseCase/AuthenticateUserUseCase";
import UserAuthenticationOutput from "../AuthenticateUserUseCase/UserAuthenticationOutput";
import AuthenticateUserGateway from "../AuthenticateUserUseCase/AuthenticateUserGateway";

export default class AuthenticateUserController implements AuthenticateUserInput
{
    public async handleAuthenticateUserRequest(authenticateUserRequest: AuthenticateUserRequest, authenticateUserGateway: AuthenticateUserGateway): Promise<AuthenticateUserResponse>
    {
        const userAuthenticationOutput: UserAuthenticationOutput = await this.authenticateUser(await this.composeUserAuthenticationInput(authenticateUserRequest), authenticateUserGateway);
        const authenticateUserPresenter: AuthenticateUserPresenter = new AuthenticateUserPresenter();
        authenticateUserPresenter.retrieveUserAuthenticationOutput(userAuthenticationOutput);

        return authenticateUserPresenter.getAuthenticateUserResponse();
    }

    public async authenticateUser(userAuthenticationInput: UserAuthenticationInput, authenticateUserGateway: AuthenticateUserGateway): Promise<UserAuthenticationOutput>
    {
        const authenticateUserUseCase: AuthenticateUserUseCase = new AuthenticateUserUseCase();
        return await authenticateUserUseCase.authenticateUser(userAuthenticationInput, authenticateUserGateway);
    }

     private async composeUserAuthenticationInput(authenticateUserRequest: AuthenticateUserRequest): Promise<UserAuthenticationInput>
    {
        const userAuthenticationInput = new UserAuthenticationInput();

        userAuthenticationInput.setEmail(authenticateUserRequest.getEmail())
        .setPassword(authenticateUserRequest.getPassword());

        return userAuthenticationInput;
    }
}