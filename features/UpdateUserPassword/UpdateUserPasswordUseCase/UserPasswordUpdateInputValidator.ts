export default interface UserPasswordUpdateInputValidator
{
    userIdIsValid(userId: string): Promise<boolean>;
    passwordMustBeAtLeast12CharactersLong(password: string): Promise<boolean>
    passwordMustHaveAtLeast3LowercaseLetters(password: string): Promise<boolean>
    passwordMustHaveAtLeast3UppercaseLetters(password: string): Promise<boolean>
    passwordMustHaveAtLeast3Symbols(password: string): Promise<boolean>
    passwordMustHaveAtLeast3Numbers(password: string): Promise<boolean>
}