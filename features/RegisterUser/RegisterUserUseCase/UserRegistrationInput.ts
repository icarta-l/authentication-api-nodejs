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
        const [passwordMustBeAtLeast12CharactersLong,
            passwordMustHaveAtLeast3LowercaseLetters,
            passwordMustHaveAtLeast3UppercaseLetters,
            passwordMustHaveAtLeast3Symbols,
            passwordMustHaveAtLeast3Numbers
        ] = await Promise.all([
            this.userRegistrationInputValidator.passwordMustBeAtLeast12CharactersLong(password),
            this.userRegistrationInputValidator.passwordMustHaveAtLeast3LowercaseLetters(password),
            this.userRegistrationInputValidator.passwordMustHaveAtLeast3UppercaseLetters(password),
            this.userRegistrationInputValidator.passwordMustHaveAtLeast3Symbols(password),
            this.userRegistrationInputValidator.passwordMustHaveAtLeast3Numbers(password)
        ]);

        if (!passwordMustBeAtLeast12CharactersLong) {
            throw new UnauthorisedActionError("Password must be at least 12 characters long");
        }

        if (!passwordMustHaveAtLeast3LowercaseLetters) {
            throw new UnauthorisedActionError("Password needs to have at least 3 lowercase letters");
        }

        if (!passwordMustHaveAtLeast3UppercaseLetters) {
            throw new UnauthorisedActionError("Password needs to have at least 3 uppercase letters");
        }

        if (!passwordMustHaveAtLeast3Symbols) {
            throw new UnauthorisedActionError("Password needs to have at least 3 symbols, special characters or space");
        }

        if (!passwordMustHaveAtLeast3Numbers) {
            throw new UnauthorisedActionError("Password needs to have at least 3 numbers");
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