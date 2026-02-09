import UserRetrievalInputValidator from "./UserRetrievalInputValidator";
import UnauthorisedActionError from "../../../../services/errors/UnauthorisedActionError";

export default class UserRetrievalInput
{
    private requestedUserId!: string;
    private userRetrievalInputValidator!: UserRetrievalInputValidator;

    constructor(userRetrievalInputValidator: UserRetrievalInputValidator) {
        this.userRetrievalInputValidator = userRetrievalInputValidator;
    }

    public getRequestedUserId(): string
    {
        return this.requestedUserId;
    }

    public async setRequestedUserId(requestedUserId: string): Promise<UserRetrievalInput>
    {
        const requestedIdIsAlphanumerical = await this.userRetrievalInputValidator.userIdIsValid(requestedUserId);

        if (!requestedIdIsAlphanumerical) {
            throw new UnauthorisedActionError("User ID is not alphanumerical", "user_id_not_alphanumerical");
        }
        
        this.requestedUserId = requestedUserId;

        return this;
    }
}