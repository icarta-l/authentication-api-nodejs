export default interface UserInformationUpdateInputValidator
{
    userIdIsValid(userId: string): Promise<boolean>;
    firstNameHasLettersOnly(firstName: string): Promise<boolean>;
    lastNameHasLettersOnly(lastName: string): Promise<boolean>;
}