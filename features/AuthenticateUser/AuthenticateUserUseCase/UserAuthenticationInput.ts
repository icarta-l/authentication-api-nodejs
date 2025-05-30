import UserAuthenticationInputValidator from "./UserAuthenticationInputValidator";
import UnauthorisedActionError from "../../../services/errors/UnauthorisedActionError";

export default class UserAuthenticationInput
{
    private email!: string;
    private password!: string;
    private userAuthenticationInputValidator: UserAuthenticationInputValidator;

    constructor(userAuthenticationInputValidator: UserAuthenticationInputValidator) {
        this.userAuthenticationInputValidator = userAuthenticationInputValidator;
    }

    public getEmail(): string
    {
        return this.email;
    }

    public async setEmail(email: string): Promise<UserAuthenticationInput>
    {
        const emailIsValid = await this.userAuthenticationInputValidator.emailMustBeValid(email);
        
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

    public setPassword(password: string): UserAuthenticationInput
    {
        this.password = password;

        return this;
    }
}