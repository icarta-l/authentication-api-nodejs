import UserRegistrationInput from "./UserRegistrationInput"

export default interface RegisterUserGateway {
    registerUser(userRegistrationInput: UserRegistrationInput): Promise<boolean>;
    emailIsAvailable(informedEmailAddress: string): Promise<boolean>;
}