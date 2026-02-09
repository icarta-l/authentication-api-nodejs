export default interface UserAuthenticationInputValidator {
    emailMustBeValid(email: string): Promise<boolean>
}