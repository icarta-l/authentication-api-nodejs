import BadRequestError from "../../../services/errors/BadRequestError";
import UpdateUserPasswordTypeValidation from "./UpdateUserPasswordTypeValidation";

export default class UpdateUserPasswordRequest
{
    private userId!: string;
    private updatedUserId!: string;
    private orignalPassword!: string;
    private changedPassword!: string;
    private changedPasswordConfirmation!: string;
    private updateUserPasswordTypeValidation: UpdateUserPasswordTypeValidation

    constructor(updateUserPasswordTypeValidation: UpdateUserPasswordTypeValidation)
    {
        this.updateUserPasswordTypeValidation = updateUserPasswordTypeValidation;
    }

    public getUserId(): string
    {
        return this.userId;
    }

    public setUserId(userId: string): UpdateUserPasswordRequest
    {
        this.updateUserPasswordTypeValidation.isString(userId, "User id");

        if (userId.length === 0) {
            throw new BadRequestError("Cannot update a user's password without a user id", "user_id_not_informed");
        }

        this.userId = userId;

        return this;
    }

    public getUpdatedUserId(): string
    {
        return this.updatedUserId;
    }

    public setUpdatedUserId(updatedUserId: string): UpdateUserPasswordRequest
    {
        this.updateUserPasswordTypeValidation.isString(updatedUserId, "Updated user id");

        if (updatedUserId.length === 0) {
            throw new BadRequestError("Cannot update a user's password without an updated user id", "updated_user_id_not_informed");
        }

        this.updatedUserId = updatedUserId;

        return this;
    }

    public getOrignalPassword(): string 
    {
        return this.orignalPassword;
    }

    public setOrignalPassword(orignalPassword: string): UpdateUserPasswordRequest
    {
        this.updateUserPasswordTypeValidation.isString(orignalPassword, "Original Password");

        if (orignalPassword.length === 0) {
            throw new BadRequestError("Cannot update a user's password without an original password informed", "original_password_not_informed");
        }

        this.orignalPassword = orignalPassword;

        return this;
    }

    public getChangedPassword(): string
    {
        return this.changedPassword;
    }

    public setChangedPassword(changedPassword: string): UpdateUserPasswordRequest
    {
        this.updateUserPasswordTypeValidation.isString(changedPassword, "Changed Password");

        if (changedPassword.length === 0) {
            throw new BadRequestError("Cannot update a user's password without a changed password informed", "changed_password_not_informed");
        }

        this.changedPassword = changedPassword;

        return this;
    }

    public getChangedPasswordConfirmation(): string
    {
        return this.changedPasswordConfirmation;
    }

    public setChangedPasswordConfirmation(changedPasswordConfirmation: string): UpdateUserPasswordRequest 
    {
        this.updateUserPasswordTypeValidation.isString(changedPasswordConfirmation, "Changed password confirmation");

        if (changedPasswordConfirmation.length === 0) {
            throw new BadRequestError("Cannot update a user's password without a changed password confirmation informed", "changed_password_confirmation_not_informed");
        }

        this.changedPasswordConfirmation = changedPasswordConfirmation;

        return this;
    }
}