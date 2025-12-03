import UserRegistrationOutput from "../RegisterUserUseCase/UserRegistrationOutput";
import RegisterUserResponse from "./RegisterUserResponse";
import RegisterUserOutput from "../RegisterUserUseCase/RegisterUserOutput";

export default class RegisterUserPresenter implements RegisterUserOutput
{
    private registerUserResponse!: RegisterUserResponse;

    public getRegisterUserResponse(): RegisterUserResponse
    {
        return this.registerUserResponse;
    }

    public retrieveUserRegistrationOutput(userRegistrationOutput: UserRegistrationOutput): void
    {
        this.registerUserResponse = new RegisterUserResponse();

        this.registerUserResponse.setWetherUserSuccessfullyRegistered(userRegistrationOutput.userIsRegistered());
    }
}