import RegisterUserRequest from "./RegisterUserRequest";
import RegisterUserResponse from "./RegisterUserResponse";

export class RegisterUserController
{
    public handleRegisterUserRequest(registerUserRequest: RegisterUserRequest): RegisterUserResponse
    {   
        return new RegisterUserResponse();
    }
}