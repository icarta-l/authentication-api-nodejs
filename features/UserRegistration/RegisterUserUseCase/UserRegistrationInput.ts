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
        const [usernameHasAtLeat3Letters, usernameHasOnlyLettersNumberAndUnderscores] = await Promise.all([this.userRegistrationInputValidator.usernameHasAtLeat3Letters(username), this.userRegistrationInputValidator.usernameHasOnlyLettersNumberAndUnderscores(username)]);

        if (! usernameHasAtLeat3Letters) {
            throw new UnauthorisedActionError("Username needs to have at least 3 letters");
        }

        if (! usernameHasOnlyLettersNumberAndUnderscores) {
            throw new UnauthorisedActionError("Username can only contain letters, numbers and underscores");
        }

        this.username = username;

        return this;
    }

    public getEmail(): string
    {
        return this.email;
    }

    public async setEmail(email: string): Promise<UserRegistrationInput>
    {
        const emailIsValid = await this.userRegistrationInputValidator.emailMustBeValid(email);

        if (!emailIsValid) {
            throw new UnauthorisedActionError("Email must be valid");
        }

        this.email = email;

        return this;
    }

    public getPassword(): string
    {
        return this.password;
    }

    public async setPassword(password: string): Promise<UserRegistrationInput>
    {
        const passwordMustBeAtLeast12CharactersLong = await this.userRegistrationInputValidator.passwordMustBeAtLeast12CharactersLong(password);

        if (!passwordMustBeAtLeast12CharactersLong) {
            throw new UnauthorisedActionError("Password must be at least 12 characters long");
        }

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