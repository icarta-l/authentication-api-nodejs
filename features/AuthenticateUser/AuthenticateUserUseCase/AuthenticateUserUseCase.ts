import UserAuthenticationInput from "./UserAuthenticationInput";
import UserAuthenticationOutput from "./UserAuthenticationOutput";
import AuthenticateUserGateway from "./AuthenticateUserGateway";

export default class AuthenticateUserUseCase
{
    public async authenticateUser(userAuthenticationInput: UserAuthenticationInput, authenticateUserGateway: AuthenticateUserGateway): Promise<UserAuthenticationOutput>
    {
        const userAuthenticationOutput = new UserAuthenticationOutput();

        try {
            const userID = await authenticateUserGateway.authenticateUser(userAuthenticationInput.getEmail(), userAuthenticationInput.getPassword());

            if (userID) {
                userAuthenticationOutput.setWetherUserSuccessfullyLoggedIn(true)
                .setUserId(userID);
            } else {
                userAuthenticationOutput.setWetherUserSuccessfullyLoggedIn(false);
            }
        } catch (error) {
            userAuthenticationOutput.setWetherUserSuccessfullyLoggedIn(false);
        }
        
        return userAuthenticationOutput;
    }
}