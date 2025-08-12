import UserRetrievalOutputValidator from "./UserRetrievalOutputValidator"
import InvalidRetrievedValuesError from "../../../services/errors/InvalidRetrievedValuesError"

export default class UserRetrievalOutput
{
    private userId!: string
    private username!: string
    private email!: string
    private firstName!: string
    private lastName!: string
    private userRetrievalOutputValidator!: UserRetrievalOutputValidator;

    constructor(userRetrievalOutputValidator: UserRetrievalOutputValidator) {
        this.userRetrievalOutputValidator = userRetrievalOutputValidator;
    }

    public getUserId(): string
    {
        return this.userId;
    }

    public setUserId(userId: string): UserRetrievalOutput
    {
        this.userId = userId;

        return this;
    }

    public getUsername(): string
    {
        return this.username;
    }

    public async setUsername(username: string): Promise<UserRetrievalOutput>
    {
        const [usernameHasAtLeat3Letters, usernameHasOnlyLettersNumberAndUnderscores] = await Promise.all([this.userRetrievalOutputValidator.usernameHasAtLeat3Letters(username), this.userRetrievalOutputValidator.usernameHasOnlyLettersNumberAndUnderscores(username)]);
        
        if (! usernameHasAtLeat3Letters) {
            throw new InvalidRetrievedValuesError("Retrieved username is not valid: username needs to have at least 3 letters");
        }

        if (! usernameHasOnlyLettersNumberAndUnderscores) {
            throw new InvalidRetrievedValuesError("Retrieved username is not valid: username can only contain letters, numbers and underscores");
        }

        this.username = username;

        return this;
    }

    public getEmail(): string
    {
        return this.email;
    }

    public async setEmail(email: string): Promise<UserRetrievalOutput>
    {
        const emailIsValid = await this.userRetrievalOutputValidator.emailMustBeValid(email);

        if (! emailIsValid) {
            throw new InvalidRetrievedValuesError("Retrieved email is not valid");
        }

        this.email = email;

        return this;
    }

    public getFirstName(): string
    {
        return this.firstName;
    }

    public async setFirstName(firstName: string): Promise<UserRetrievalOutput>
    {
        const firstNameHasLettersOnly = await this.userRetrievalOutputValidator.firstNameHasLettersOnly(firstName);

        if (! firstNameHasLettersOnly) {
            throw new InvalidRetrievedValuesError("Retrieved first name is not valid");
        }

        this.firstName = firstName;

        return this;
    }

    public getLastName(): string
    {
        return this.lastName;
    }

    public async setLastName(lastName: string): Promise<UserRetrievalOutput>
    {
        const lastNameHasLettersOnly = await this.userRetrievalOutputValidator.lastNameHasLettersOnly(lastName);

        if (! lastNameHasLettersOnly) {
            throw new InvalidRetrievedValuesError("Retrieved last name is not valid");
        }

        this.lastName = lastName;

        return this;
    }
}