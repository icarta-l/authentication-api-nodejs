import UpdateUserInformationTypeValidation from "./UpdateUserInformationTypeValidation";
import BadRequestError from "../../../../services/errors/BadRequestError";

export default class UpdateUserInformationRequest
{
    private userId!: string;
    private updatedUserId!: string;
    private firstName!: string;
    private lastName!: string;
    private updateUserInformationTypeValidation: UpdateUserInformationTypeValidation
    
    constructor(updateUserInformationTypeValidation: UpdateUserInformationTypeValidation)
    {
        this.updateUserInformationTypeValidation = updateUserInformationTypeValidation;
    }

    public getUserId(): string
    {
        return this.userId;
    }

    public setUserId(userId: string): UpdateUserInformationRequest
    {
        this.updateUserInformationTypeValidation.isString(userId, "User id");

        if (userId.length === 0) {
            throw new BadRequestError("Cannot update a user without a user id", "user_id_not_informed");
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
        this.updateUserInformationTypeValidation.isString(updatedUserId, "Updated user id");

        if (updatedUserId.length === 0) {
            throw new BadRequestError("Cannot update a user without an updated user id", "updated_user_id_not_informed");
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
        this.updateUserInformationTypeValidation.isString(firstName, "First name");

        if (firstName.length === 0) {
            throw new BadRequestError("Cannot update a user without a first name", "first_name_not_informed");
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
        this.updateUserInformationTypeValidation.isString(lastName, "Last name");

        if (lastName.length === 0) {
            throw new BadRequestError("Cannot update a user without a last name", "last_name_not_informed");
        }

        this.lastName = lastName;

        return this;
    }
}