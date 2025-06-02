import UserAuthenticationInput from "./UserAuthenticationInput";
import AuthenticateUserOutput from "./AuthenticateUserOutput";

export default interface AuthenticateUserInput
{
    authenticateUser(userAuthenticationInput: UserAuthenticationInput): AuthenticateUserOutput;
}