import UserRegistrationInput from "./UserRegistrationInput";
import RegisterUserGateway from "./RegisterUserGateway";
import UserRegistrationOutput from "./UserRegistrationOutput";

export default class RegisterUserUseCase
{
    public async registerUser(userRegistrationInput: UserRegistrationInput, registerUserGateway: RegisterUserGateway): Promise<UserRegistrationOutput>
    {
        const userRegistrationOutput: UserRegistrationOutput = new UserRegistrationOutput();

        userRegistrationOutput.setWetherUserSuccessfullyRegistered(await registerUserGateway.registerUser(userRegistrationInput));

        return userRegistrationOutput;
    }
}