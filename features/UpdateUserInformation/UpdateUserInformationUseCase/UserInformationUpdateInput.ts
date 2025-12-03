import UserInformationUpdateInputValidator from "./UserInformationUpdateInputValidator";
import UnauthorisedActionError from "../../../services/errors/UnauthorisedActionError";

export default class UserInformationUpdateInput 
{
    private userId!: string;
    private updatedUserId!: string;
    private firstName!: string;
    private lastName!: string;
    private userInformationUpdateInputValidator: UserInformationUpdateInputValidator;

    constructor(userInformationUpdateInputValidator: UserInformationUpdateInputValidator) {
        this.userInformationUpdateInputValidator = userInformationUpdateInputValidator;
    }

    public getUserId(): string
    {
        return this.userId;
    }

    public async setUserId(userId: string): Promise<UserInformationUpdateInput>
    {
        const requestedIdIsAlphanumerical = await this.userInformationUpdateInputValidator.userIdIsValid(userId);
        
        if (!requestedIdIsAlphanumerical) {
            throw new UnauthorisedActionError("User ID is not alphanumerical");
        }

        this.userId = userId;

        return this;
    }

    public getUpdatedUserId(): string
    {
        return this.updatedUserId;
    }

    public async setUpdatedUserId(updatedUserId: string): Promise<UserInformationUpdateInput>
    {
        const requestedIdIsAlphanumerical = await this.userInformationUpdateInputValidator.userIdIsValid(updatedUserId);
        
        if (!requestedIdIsAlphanumerical) {
            throw new UnauthorisedActionError("Updated User ID is not alphanumerical");
        }

        this.updatedUserId = updatedUserId;

        return this;
    }

    public getFirstName(): string
    {
        return this.firstName;
    }

    public async setFirstName(firstName: string): Promise<UserInformationUpdateInput>
    {
        const firstNameHasLettersOnly = await this.userInformationUpdateInputValidator.firstNameHasLettersOnly(firstName);
        
        if (! firstNameHasLettersOnly) {
            throw new UnauthorisedActionError("First name must be letters only");
        }

        this.firstName = firstName;

        return this;
    }

    public getLastName(): string
    {
        return this.lastName;
    }

    public async setLastName(lastName: string): Promise<UserInformationUpdateInput>
    {
        const lastNameHasLettersOnly = await this.userInformationUpdateInputValidator.lastNameHasLettersOnly(lastName);
        
        if (! lastNameHasLettersOnly) {
            throw new UnauthorisedActionError("Last name must be letters only");
        }

        this.lastName = lastName;

        return this;
    }
}