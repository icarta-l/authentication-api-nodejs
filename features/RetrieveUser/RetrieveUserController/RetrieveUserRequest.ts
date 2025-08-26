export default class RetrieveUserRequest
{
    private requestedUserId!: string;

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