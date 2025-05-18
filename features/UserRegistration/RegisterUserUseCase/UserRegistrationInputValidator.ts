export default interface UserRegistrationInputValidator {
    usernameHasAtLeat3Letters(username: string): Promise<boolean>
    usernameHasOnlyLettersNumberAndUnderscores(username: string): Promise<boolean>
    emailMustBeValid(email: string): Promise<boolean>
    passwordMustBeAtLeast12CharactersLong(password: string): Promise<boolean>
}