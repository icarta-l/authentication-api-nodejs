import AuthenticateUserRequest from "./AuthenticateUserRequest";
import AuthenticateUserResponse from "./AuthenticateUserResponse";
import AuthenticateUserPresenter from "./AuthenticateUserPresenter";
import AuthenticateUserInput from "../AuthenticateUserUseCase/AuthenticateUserInput";
import UserAuthenticationInput from "../AuthenticateUserUseCase/UserAuthenticationInput";
import AuthenticateUserUseCase from "../AuthenticateUserUseCase/AuthenticateUserUseCase";
import UserAuthenticationOutput from "../AuthenticateUserUseCase/UserAuthenticationOutput";
import AuthenticateUserGateway from "../AuthenticateUserUseCase/AuthenticateUserGateway";
import UserAuthenticationInputValidator from "../AuthenticateUserUseCase/UserAuthenticationInputValidator";

export default class AuthenticateUserController implements AuthenticateUserInput
{
    public async handleAuthenticateUserRequest(authenticateUserRequest: AuthenticateUserRequest, authenticateUserGateway: AuthenticateUserGateway, userAuthenticationInputValidator: UserAuthenticationInputValidator): Promise<AuthenticateUserResponse>
    {
        const userAuthenticationOutput: UserAuthenticationOutput = await this.authenticateUser(await this.composeUserAuthenticationInput(authenticateUserRequest, userAuthenticationInputValidator), authenticateUserGateway);
        const authenticateUserPresenter: AuthenticateUserPresenter = new AuthenticateUserPresenter();
        authenticateUserPresenter.retrieveUserAuthenticationOutput(userAuthenticationOutput);

        return authenticateUserPresenter.getAuthenticateUserResponse();
    }

    public async authenticateUser(userAuthenticationInput: UserAuthenticationInput, authenticateUserGateway: AuthenticateUserGateway): Promise<UserAuthenticationOutput>
    {
        const authenticateUserUseCase: AuthenticateUserUseCase = new AuthenticateUserUseCase();
        return await authenticateUserUseCase.authenticateUser(userAuthenticationInput, authenticateUserGateway);
    }

     private async composeUserAuthenticationInput(authenticateUserRequest: AuthenticateUserRequest, userAuthenticationInputValidator: UserAuthenticationInputValidator): Promise<UserAuthenticationInput>
    {
        const userAuthenticationInput = new UserAuthenticationInput(userAuthenticationInputValidator);

        await userAuthenticationInput.setEmail(authenticateUserRequest.getEmail());
        userAuthenticationInput.setPassword(authenticateUserRequest.getPassword());

        return userAuthenticationInput;
    }
}