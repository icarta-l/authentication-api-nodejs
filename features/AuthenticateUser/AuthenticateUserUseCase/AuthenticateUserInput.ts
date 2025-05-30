import UserAuthenticationInput from "./UserAuthenticationInput";
import UserAuthenticationOutput from "./UserAuthenticationOutput";
import AuthenticateUserGateway from "./AuthenticateUserGateway";

export default interface AuthenticateUserInput
{
    authenticateUser(userAuthenticationInput: UserAuthenticationInput, authenticateUserGateway: AuthenticateUserGateway): Promise<UserAuthenticationOutput>;
}