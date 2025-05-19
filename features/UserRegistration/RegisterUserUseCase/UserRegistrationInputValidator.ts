export default interface UserRegistrationInputValidator {
    usernameHasAtLeat3Letters(username: string): Promise<boolean>
    usernameHasOnlyLettersNumberAndUnderscores(username: string): Promise<boolean>
    emailMustBeValid(email: string): Promise<boolean>
    passwordMustBeAtLeast12CharactersLong(password: string): Promise<boolean>
    passwordMustHaveAtLeast3LowercaseLetters(password: string): Promise<boolean>
    passwordMustHaveAtLeast3UppercaseLetters(password: string): Promise<boolean>
    passwordMustHaveAtLeast3Symbols(password: string): Promise<boolean>
    passwordMustHaveAtLeast3Numbers(password: string): Promise<boolean>
}