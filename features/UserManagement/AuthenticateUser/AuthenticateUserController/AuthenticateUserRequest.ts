import BadRequestError from "../../../../services/errors/BadRequestError";
import AuthenticateUserTypeValidation from "./AuthenticateUserTypeValidation";

export default class AuthenticateUserRequest
{
    private email!: string;
    private password!: string;
    private authenticateUserTypeValidation: AuthenticateUserTypeValidation
                
    constructor(authenticateUserTypeValidation: AuthenticateUserTypeValidation)
    {
        this.authenticateUserTypeValidation = authenticateUserTypeValidation;
    }

    public getEmail(): string
    {
        return this.email;
    }

    public setEmail(email: string): AuthenticateUserRequest
    {
        this.authenticateUserTypeValidation.isString(email, "Email");

        if (email.length === 0) {
            throw new BadRequestError("User cannot authenticate without an email", "email_not_informed");
        }

        this.email = email;

        return this;
    }

    public getPassword(): string
    {
        return this.password;
    }

    public setPassword(password: string): AuthenticateUserRequest
    {
        this.authenticateUserTypeValidation.isString(password, "Password");

        if (password.length === 0) {
            throw new BadRequestError("User cannot authenticate without a password", "password_not_informed");
        }

        this.password = password;

        return this;
    }
}