import UserAuthenticationOutput from "./UserAuthenticationOutput";

export default interface AuthenticateUserOutput
{
    retrieveUserAuthenticationOutput(userAuthenticationOutput: UserAuthenticationOutput): void;
}