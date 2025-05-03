import RegisterUserRequest from "./RegisterUserRequest";
import RegisterUserResponse from "./RegisterUserResponse";
import RegisterUserInput from "../RegisterUserUseCase/RegisterUserInput";
import UserRegistrationOutput from "../RegisterUserUseCase/UserRegistrationOutput";
import UserRegistrationInput from "../RegisterUserUseCase/UserRegistrationInput";
import RegisterUserGateway from "../RegisterUserUseCase/RegisterUserGateway";
import RegisterUserPresenter from "./RegisterUserPresenter";
import RegisterUserUseCase from "../RegisterUserUseCase/RegisterUserUseCase";

export default class RegisterUserController implements RegisterUserInput
{
    public async handleRegisterUserRequest(registerUserRequest: RegisterUserRequest, registerUserGateway: RegisterUserGateway): Promise<RegisterUserResponse>
    {   
        const userRegistrationOutput: UserRegistrationOutput = await this.registerUser(this.composeUserRegistrationInput(registerUserRequest), registerUserGateway);
        const registerUserPresenter: RegisterUserPresenter = new RegisterUserPresenter();
        registerUserPresenter.retrieveUserRegistrationOutput(userRegistrationOutput);

        return registerUserPresenter.getRegisterUserResponse();
    }

    public async registerUser(userRegistrationInput: UserRegistrationInput, registerUserGateway: RegisterUserGateway): Promise<UserRegistrationOutput>
    {
        const registerUserUseCase: RegisterUserUseCase = new RegisterUserUseCase();
        return registerUserUseCase.registerUser(userRegistrationInput, registerUserGateway);
    }

    private composeUserRegistrationInput(registerUserRequest: RegisterUserRequest): UserRegistrationInput
    {
        const userRegistrationInput = new UserRegistrationInput();

        userRegistrationInput.setUsername(registerUserRequest.getUsername())
        .setEmail(registerUserRequest.getEmail())
        .setPassword(registerUserRequest.getPassword())
        .setFirstName(registerUserRequest.getFirstName())
        .setLastName(registerUserRequest.getLastName());

        return userRegistrationInput;
    }
}