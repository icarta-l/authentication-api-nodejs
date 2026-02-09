import UserPasswordUpdateInputValidator from "./UserPasswordUpdateInputValidator";
import UnauthorisedActionError from "../../../../services/errors/UnauthorisedActionError";

export default class UserPasswordUpdateInput 
{
    private userId!: string;
    private updatedUserId!: string;
    private orignalPassword!: string;
    private changedPassword!: string;
    private changedPasswordConfirmation!: string;
    private userPasswordUpdateInputValidator: UserPasswordUpdateInputValidator;
    
    constructor(userPasswordUpdateInputValidator: UserPasswordUpdateInputValidator) {
        this.userPasswordUpdateInputValidator = userPasswordUpdateInputValidator;
    }

    public getUserId(): string
    {
        return this.userId;
    }

    public async setUserId(userId: string): Promise<UserPasswordUpdateInput>
    {
        const requestedIdIsAlphanumerical = await this.userPasswordUpdateInputValidator.userIdIsValid(userId);
                
        if (!requestedIdIsAlphanumerical) {
            throw new UnauthorisedActionError("User ID is not alphanumerical", "user_id_not_alphanumerical");
        }

        this.userId = userId;

        return this;
    }

    public getUpdatedUserId(): string
    {
        return this.updatedUserId;
    }

    public async setUpdatedUserId(updatedUserId: string): Promise<UserPasswordUpdateInput>
    {
        const requestedIdIsAlphanumerical = await this.userPasswordUpdateInputValidator.userIdIsValid(updatedUserId);
                
        if (!requestedIdIsAlphanumerical) {
            throw new UnauthorisedActionError("Updated user ID is not alphanumerical", "updated_user_id_not_alphanumerical");
        }

        this.updatedUserId = updatedUserId;

        return this;
    }

    public getOrignalPassword(): string
    {
        return this.orignalPassword;
    }

    private async passwordIsValid(password: string, parameterName: string): Promise<void>
    {
        const [passwordMustBeAtLeast12CharactersLong,
            passwordMustHaveAtLeast3LowercaseLetters,
            passwordMustHaveAtLeast3UppercaseLetters,
            passwordMustHaveAtLeast3Symbols,
            passwordMustHaveAtLeast3Numbers
        ] = await Promise.all([
            this.userPasswordUpdateInputValidator.passwordMustBeAtLeast12CharactersLong(password),
            this.userPasswordUpdateInputValidator.passwordMustHaveAtLeast3LowercaseLetters(password),
            this.userPasswordUpdateInputValidator.passwordMustHaveAtLeast3UppercaseLetters(password),
            this.userPasswordUpdateInputValidator.passwordMustHaveAtLeast3Symbols(password),
            this.userPasswordUpdateInputValidator.passwordMustHaveAtLeast3Numbers(password)
        ]);

        if (!passwordMustBeAtLeast12CharactersLong) {
            throw new UnauthorisedActionError(parameterName + " must be at least 12 characters long", parameterName.toLowerCase().replaceAll(" ", "_") + "_doesnt_have_12_characters");
        }

        if (!passwordMustHaveAtLeast3LowercaseLetters) {
            throw new UnauthorisedActionError(parameterName + " needs to have at least 3 lowercase letters", parameterName.toLowerCase().replaceAll(" ", "_") + "_doesnt_have_3_lowercase_letters");
        }

        if (!passwordMustHaveAtLeast3UppercaseLetters) {
            throw new UnauthorisedActionError(parameterName + " needs to have at least 3 uppercase letters", parameterName.toLowerCase().replaceAll(" ", "_") + "_doesnt_have_3_uppercase_letters");
        }

        if (!passwordMustHaveAtLeast3Symbols) {
            throw new UnauthorisedActionError(parameterName + " needs to have at least 3 symbols, special characters or space", parameterName.toLowerCase().replaceAll(" ", "_") + "_miss_special_characters");
        }

        if (!passwordMustHaveAtLeast3Numbers) {
            throw new UnauthorisedActionError(parameterName + " needs to have at least 3 numbers", parameterName.toLowerCase().replaceAll(" ", "_") + "_doesnt_have_3_numbers");
        }
    }

    public async setOrignalPassword(orignalPassword: string): Promise<UserPasswordUpdateInput>
    {
        await this.passwordIsValid(orignalPassword, "Original password");

        this.orignalPassword = orignalPassword;

        return this;
    }

    public getChangedPassword(): string
    {
        return this.changedPassword;
    }

    public async setChangedPassword(changedPassword: string): Promise<UserPasswordUpdateInput>
    {
        await this.passwordIsValid(changedPassword, "Changed password");

        this.changedPassword = changedPassword;

        return this;
    }

    public getChangedPasswordConfirmation(): string
    {
        return this.changedPasswordConfirmation;
    }

    public async setChangedPasswordConfirmation(changedPasswordConfirmation: string): Promise<UserPasswordUpdateInput>
    {
        await this.passwordIsValid(changedPasswordConfirmation, "Changed password confirmation");

        this.changedPasswordConfirmation = changedPasswordConfirmation;

        return this;
    }
}