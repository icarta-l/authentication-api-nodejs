import RegisterUserRequest from "./RegisterUserRequest";
import RegisterUserResponse from "./RegisterUserResponse";

export default class RegisterUserController
{
    public handleRegisterUserRequest(registerUserRequest: RegisterUserRequest): RegisterUserResponse
    {   
        return new RegisterUserResponse();
    }
}