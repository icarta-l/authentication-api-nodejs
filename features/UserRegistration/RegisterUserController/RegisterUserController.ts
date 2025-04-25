import RegisterUserRequest from "./RegisterUserRequest";
import RegisterUserResponse from "./RegisterUserResponse";
import RegisterUserInput from "../RegisterUserUseCase/RegisterUserInput";
import UserRegistrationOutput from "../RegisterUserUseCase/UserRegistrationOutput";
import UserRegistrationInput from "../RegisterUserUseCase/UserRegistrationInput";
import RegisterUserGateway from "../RegisterUserUseCase/RegisterUserGateway";
import RegisterUserPresenter from "./RegisterUserPresenter";
import RegisterUserUseCase from "../RegisterUserUseCase/RegisterUserUseCase";
import UserRegistrationInputValidator from "../RegisterUserUseCase/UserRegistrationInputValidator";

export default class RegisterUserController implements RegisterUserInput
{
    public async handleRegisterUserRequest(registerUserRequest: RegisterUserRequest, registerUserGateway: RegisterUserGateway, userRegistrationInputValidator: UserRegistrationInputValidator): Promise<RegisterUserResponse>
    {   
        const userRegistrationOutput: UserRegistrationOutput = await this.registerUser(await this.composeUserRegistrationInput(registerUserRequest, userRegistrationInputValidator), registerUserGateway);
        const registerUserPresenter: RegisterUserPresenter = new RegisterUserPresenter();
        registerUserPresenter.retrieveUserRegistrationOutput(userRegistrationOutput);

        return registerUserPresenter.getRegisterUserResponse();
    }

    public async registerUser(userRegistrationInput: UserRegistrationInput, registerUserGateway: RegisterUserGateway): Promise<UserRegistrationOutput>
    {
        const registerUserUseCase: RegisterUserUseCase = new RegisterUserUseCase();
        return registerUserUseCase.registerUser(userRegistrationInput, registerUserGateway);
    }

    private async composeUserRegistrationInput(registerUserRequest: RegisterUserRequest, userRegistrationInputValidator: UserRegistrationInputValidator): Promise<UserRegistrationInput>
    {
        const userRegistrationInput = new UserRegistrationInput(userRegistrationInputValidator);

        await userRegistrationInput.setUsername(registerUserRequest.getUsername());
        await userRegistrationInput.setEmail(registerUserRequest.getEmail());
        await userRegistrationInput.setPassword(registerUserRequest.getPassword());
        userRegistrationInput.setFirstName(registerUserRequest.getFirstName())
        .setLastName(registerUserRequest.getLastName());

        return userRegistrationInput;
    }
}