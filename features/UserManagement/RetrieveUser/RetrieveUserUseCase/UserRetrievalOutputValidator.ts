export default interface UserRetrievalOutputValidator
{
    usernameHasAtLeat3Letters(username: string): Promise<boolean>;
    usernameHasOnlyLettersNumberAndUnderscores(username: string): Promise<boolean>;
    emailMustBeValid(email: string): Promise<boolean>;
    firstNameHasLettersOnly(firstName: string): Promise<boolean>;
    lastNameHasLettersOnly(lastName: string): Promise<boolean>;
}