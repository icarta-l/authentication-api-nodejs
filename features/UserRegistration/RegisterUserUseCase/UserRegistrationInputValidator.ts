export default interface UserRegistrationInputValidator {
    usernameHasAtLeat3Letters(username: string): Promise<boolean>
}