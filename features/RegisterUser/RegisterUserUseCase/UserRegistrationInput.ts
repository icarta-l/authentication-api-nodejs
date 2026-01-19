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
            throw new UnauthorisedActionError("Username needs to have at least 3 letters", "username_must_have_at_least_3_letters");
        }

        if (! usernameHasOnlyLettersNumberAndUnderscores) {
            throw new UnauthorisedActionError("Username can only contain letters, numbers and underscores", "username_has_special_characters");
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
            throw new UnauthorisedActionError("Email must be valid", "email_is_invalid");
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
            throw new UnauthorisedActionError("Password must be at least 12 characters long", "password_doesnt_have_12_characters");
        }

        if (!passwordMustHaveAtLeast3LowercaseLetters) {
            throw new UnauthorisedActionError("Password needs to have at least 3 lowercase letters", "password_doesnt_have_3_lowercase_letters");
        }

        if (!passwordMustHaveAtLeast3UppercaseLetters) {
            throw new UnauthorisedActionError("Password needs to have at least 3 uppercase letters", "password_doesnt_have_3_uppercase_letters");
        }

        if (!passwordMustHaveAtLeast3Symbols) {
            throw new UnauthorisedActionError("Password needs to have at least 3 symbols, special characters or space", "password_miss_special_characters");
        }

        if (!passwordMustHaveAtLeast3Numbers) {
            throw new UnauthorisedActionError("Password needs to have at least 3 numbers", "password_doesnt_have_3_numbers");
        }

        this.password = password;

        return this;
    }
    
    public getFirstName(): string
    {
        return this.firstName;
    }

    public async setFirstName(firstName: string): Promise<UserRegistrationInput>
    {
        const firstNameHasLettersOnly = await this.userRegistrationInputValidator.firstNameHasLettersOnly(firstName);
        
        if (! firstNameHasLettersOnly) {
            throw new UnauthorisedActionError("Firstname needs to have letters only", "first_name_not_letters_only");
        }

        this.firstName = firstName;

        return this;
    }

    public getLastName(): string
    {
        return this.lastName;
    }

    public async setLastName(lastName: string): Promise<UserRegistrationInput>
    {
        const lastNameHasLettersOnly = await this.userRegistrationInputValidator.lastNameHasLettersOnly(lastName);
        
        if (! lastNameHasLettersOnly) {
            throw new UnauthorisedActionError("Lastname needs to have letters only", "last_name_not_letters_only");
        }

        this.lastName = lastName;

        return this;
    }
}