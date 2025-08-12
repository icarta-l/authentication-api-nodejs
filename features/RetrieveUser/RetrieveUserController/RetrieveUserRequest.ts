import BadRequestError from "../../../services/errors/BadRequestError";

export default class RetrieveUserRequest
{
    private requestedUserId!: string;

    public getRequestedUserId(): string
    {
        return this.requestedUserId;
    }

    public setRequestedUserId(requestedUserId: string): RetrieveUserRequest
    {
        if (requestedUserId.length === 0) {
            throw new BadRequestError("Cannot retrieve a user without a requested user id");
        }

        this.requestedUserId = requestedUserId;

        return this;
    }
}