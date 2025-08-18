export default class RetrieveUserRequest
{
    private userId!: string;
    private requestedUserId!: string;
    
    public getUserId(): string
    {
        return this.userId;
    }

    public setUserId(userId: string): RetrieveUserRequest
    {
        this.userId = userId;

        return this;
    }

    public getRequestedUserId(): string
    {
        return this.requestedUserId;
    }

    public setRequestedUserId(requestedUserId: string): RetrieveUserRequest
    {
        this.requestedUserId = requestedUserId;

        return this;
    }
}