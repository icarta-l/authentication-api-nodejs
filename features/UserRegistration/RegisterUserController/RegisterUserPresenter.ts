import UserRegistrationOutput from "../RegisterUserUseCase/UserRegistrationOutput";
import RegisterUserResponse from "./RegisterUserResponse";

export default class RegisterUserPresenter
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