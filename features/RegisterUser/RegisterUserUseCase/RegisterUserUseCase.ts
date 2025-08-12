import UserRegistrationInput from "./UserRegistrationInput";
import RegisterUserGateway from "./RegisterUserGateway";
import UserRegistrationOutput from "./UserRegistrationOutput";
import UnauthorisedActionError from "../../../services/errors/UnauthorisedActionError";

export default class RegisterUserUseCase
{
    public async registerUser(userRegistrationInput: UserRegistrationInput, registerUserGateway: RegisterUserGateway): Promise<UserRegistrationOutput>
    {
        const userRegistrationOutput: UserRegistrationOutput = new UserRegistrationOutput();

        const emailIsAvailable = await registerUserGateway.emailIsAvailable(userRegistrationInput.getEmail());

        if (! emailIsAvailable) {
            throw new UnauthorisedActionError("Email was already registered by another user");
        }

        userRegistrationOutput.setWetherUserSuccessfullyRegistered(await registerUserGateway.registerUser(userRegistrationInput));

        return userRegistrationOutput;
    }
}