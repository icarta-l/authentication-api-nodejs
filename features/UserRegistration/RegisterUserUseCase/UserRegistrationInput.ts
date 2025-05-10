import UserRegistrationInputValidator from "./UserRegistrationInputValidator";
import UnauthorisedActionError from "../../../services/errors/UnauthorisedActionError";

export default class UserRegistrationInput {
    private username!: string;
    private email!: string;
    private password!: string;
    private firstName!: string;
    private lastName!: string;
    private userRegistrationInputValidator: UserRegistrationInputValidator;

    constructor(userRegistrationInputValidator: UserRegistrationInputValidator) {
        this.userRegistrationInputValidator = userRegistrationInputValidator;
    }

    public getUsername(): string
    {
        return this.username;
    }

    public async setUsername(username: string): Promise<UserRegistrationInput>
    {
        const usernameHasAtLeat3Letters = await this.userRegistrationInputValidator.usernameHasAtLeat3Letters(username);

        if (! usernameHasAtLeat3Letters) {
            throw new UnauthorisedActionError("Username needs to have at least 3 letters");
        }

        this.username = username;

        return this;
    }

    public getEmail(): string
    {
        return this.email;
    }

    public setEmail(email: string): UserRegistrationInput
    {
        this.email = email;

        return this;
    }

    public getPassword(): string
    {
        return this.password;
    }

    public setPassword(password: string): UserRegistrationInput
    {
        this.password = password;

        return this;
    }
    
    public getFirstName(): string
    {
        return this.firstName;
    }

    public setFirstName(firstName: string): UserRegistrationInput
    {
        this.firstName = firstName;

        return this;
    }

    public getLastName(): string
    {
        return this.lastName;
    }

    public setLastName(lastName: string): UserRegistrationInput
    {
        this.lastName = lastName;

        return this;
    }
}