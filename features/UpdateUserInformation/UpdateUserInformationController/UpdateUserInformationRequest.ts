import BadRequestError from "../../../services/errors/BadRequestError";

export default class UpdateUserInformationRequest
{
    private userId!: string;
    private updatedUserId!: string;
    private firstName!: string;
    private lastName!: string;

    public getUserId(): string
    {
        return this.userId;
    }

    public setUserId(userId: string): UpdateUserInformationRequest
    {
        if (userId.length === 0) {
            throw new BadRequestError("Cannot update a user without a user id");
        }

        this.userId = userId;

        return this;
    }

    public getUpdatedUserId(): string
    {
        return this.updatedUserId;
    }

    public setUpdatedUserId(updatedUserId: string): UpdateUserInformationRequest
    {
        if (updatedUserId.length === 0) {
            throw new BadRequestError("Cannot update a user without an updated user id");
        }

        this.updatedUserId = updatedUserId;

        return this;
    }

    public getFirstName(): string
    {
        return this.firstName;
    }

    public setFirstName(firstName: string): UpdateUserInformationRequest
    {
        if (firstName.length === 0) {
            throw new BadRequestError("Cannot update a user without a first name");
        }

        this.firstName = firstName;

        return this;
    }

    public getLastName(): string
    {
        return this.lastName;
    }

    public setLastName(lastName: string): UpdateUserInformationRequest
    {
        if (lastName.length === 0) {
            throw new BadRequestError("Cannot update a user without a last name");
        }

        this.lastName = lastName;

        return this;
    }
}