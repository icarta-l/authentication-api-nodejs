export default interface UserRetrievalInputValidator
{
    userIdIsValid(userId: string): Promise<boolean>;
}