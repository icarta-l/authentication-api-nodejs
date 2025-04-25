import UserRegistrationInput from "./UserRegistrationInput";
import RegisterUserGateway from "./RegisterUserGateway";
import UserRegistrationOutput from "./UserRegistrationOutput";

export default interface RegisterUserInput {
    registerUser(userRegistrationInput: UserRegistrationInput, registerUserGateway: RegisterUserGateway): Promise<UserRegistrationOutput>
}