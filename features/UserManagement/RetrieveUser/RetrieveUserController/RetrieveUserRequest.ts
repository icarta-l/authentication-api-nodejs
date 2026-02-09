import BadRequestError from "../../../../services/errors/BadRequestError";
import RetrieveUserTypeValidation from "../RetrieveUserController/RetrieveUserTypeValidation";

export default class RetrieveUserRequest
{
    private requestedUserId!: string;

    private retrieveUserTypeValidation: RetrieveUserTypeValidation
        
    constructor(retrieveUserTypeValidation: RetrieveUserTypeValidation)
    {
        this.retrieveUserTypeValidation = retrieveUserTypeValidation;
    }

    public getRequestedUserId(): string
    {
        return this.requestedUserId;
    }

    public setRequestedUserId(requestedUserId: string): RetrieveUserRequest
    {
        this.retrieveUserTypeValidation.isString(requestedUserId, "Requested user id");

        if (requestedUserId.length === 0) {
            throw new BadRequestError("Cannot retrieve a user without a requested user id", "user_id_not_informed");
        }

        this.requestedUserId = requestedUserId;

        return this;
    }
}