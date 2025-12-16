import UserPasswordUpdateInput from "./UserPasswordUpdateInput";
import UpdateUserPasswordGateway from "./UpdateUserPasswordGateway";
import UserPasswordUpdateOutput from "./UserPasswordUpdateOutput";
import UnauthorisedActionError from "../../../services/errors/UnauthorisedActionError";

export default class UpdateUserPasswordUseCase 
{
    public async updateUserPassword(userPasswordUpdateInput: UserPasswordUpdateInput, updateUserPasswordGateway: UpdateUserPasswordGateway): Promise<UserPasswordUpdateOutput>
    {
        if (await this.checkWeatherUserIsAllowedToUpdatePassword(userPasswordUpdateInput, updateUserPasswordGateway)) {
            await this.checkPasswordUpdateIsValid(userPasswordUpdateInput, updateUserPasswordGateway);
    
            const userPasswordUpdateOutput: UserPasswordUpdateOutput = await updateUserPasswordGateway.updateUserPassword(userPasswordUpdateInput);
    
            return userPasswordUpdateOutput;
        }

        throw new Error("Couldn't update user information");
    }

    private async checkPasswordUpdateIsValid(userPasswordUpdateInput: UserPasswordUpdateInput, updateUserPasswordGateway: UpdateUserPasswordGateway): Promise<void>
    {
        await this.checkThatOriginalPasswordIsRecognised(userPasswordUpdateInput, updateUserPasswordGateway);
        this.checkThatChangedPasswordAndChangedPasswordConfirmationMatch(userPasswordUpdateInput);
        this.checktThatOriginalPasswordAndChangedPasswordAreDifferent(userPasswordUpdateInput);
    }

    private async checkWeatherUserIsAllowedToUpdatePassword(userPasswordUpdateInput: UserPasswordUpdateInput, updateUserPasswordGateway: UpdateUserPasswordGateway): Promise<boolean>
    {
        switch (await updateUserPasswordGateway.getUserRole(userPasswordUpdateInput.getUserId())) {
            case "User":
                if (! this.userIsTryingToUpdateItsOwnPassword(userPasswordUpdateInput)) {
                    throw new UnauthorisedActionError("Cannot update another user's password", "cannot_update_another_user_s_password");
                }

                return true;
            
            default:
                throw new UnauthorisedActionError("User role was not recognised", "user_role_not_recognised");
        }
    }

    private userIsTryingToUpdateItsOwnPassword(userPasswordUpdateInput: UserPasswordUpdateInput): boolean
    {
        return userPasswordUpdateInput.getUserId() === userPasswordUpdateInput.getUpdatedUserId();
    }

    private async checkThatOriginalPasswordIsRecognised(userPasswordUpdateInput: UserPasswordUpdateInput, updateUserPasswordGateway: UpdateUserPasswordGateway): Promise<void>
    {
        if (! await updateUserPasswordGateway.originalPasswordMatches(userPasswordUpdateInput.getUpdatedUserId(), userPasswordUpdateInput.getOrignalPassword())) {
            throw new UnauthorisedActionError("Original password is not recognised", "original_password_not_recognised");
        }
    }

    private checkThatChangedPasswordAndChangedPasswordConfirmationMatch(userPasswordUpdateInput: UserPasswordUpdateInput): void
    {
        if (userPasswordUpdateInput.getChangedPassword() !== userPasswordUpdateInput.getChangedPasswordConfirmation()) {
            throw new UnauthorisedActionError("Changed password and confirmation do not match", "changed_password_and_confirmation_do_not_match");
        }
    }

    private checktThatOriginalPasswordAndChangedPasswordAreDifferent(userPasswordUpdateInput: UserPasswordUpdateInput): void
    {
        if (userPasswordUpdateInput.getOrignalPassword() === userPasswordUpdateInput.getChangedPassword()) {
            throw new UnauthorisedActionError("Original password and changed password are identical", "original_password_and_changed_password_identical");
        }
    }
}