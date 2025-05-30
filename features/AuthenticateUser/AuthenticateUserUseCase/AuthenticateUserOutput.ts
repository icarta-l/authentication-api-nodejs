import UserAuthenticationOutput from "./AuthenticateUserOutput";

export default interface AuthenticateUserOutput
{
    retrieveUserAuthenticationOutput(userAuthenticationOutput: UserAuthenticationOutput): void;
}