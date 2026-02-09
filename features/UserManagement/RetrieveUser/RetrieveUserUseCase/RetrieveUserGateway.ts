import UserRetrievalOutput from "./UserRetrievalOutput";

export default interface RetrieveUserGateway
{
    retrieveUser(userId: string): Promise<UserRetrievalOutput|false>;
}