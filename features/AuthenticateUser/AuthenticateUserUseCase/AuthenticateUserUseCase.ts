import UserAuthenticationInput from "./UserAuthenticationInput";
import AuthenticateUserOutput from "./AuthenticateUserOutput";

export default class AuthenticateUserUseCase
{
    public authenticateUser(userAuthenticationInput: UserAuthenticationInput): AuthenticateUserOutput
    {
        return new AuthenticateUserOutput();
    }
}