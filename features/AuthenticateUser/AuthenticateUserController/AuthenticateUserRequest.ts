import BadRequestError from "../../../services/errors/BadRequestError";

export default class AuthenticateUserRequest
{
    private email!: string;
    private password!: string;

    public getEmail(): string
    {
        return this.email;
    }

    public setEmail(email: string): AuthenticateUserRequest
    {
        if (email.length === 0) {
            throw new BadRequestError("User cannot authenticate without an email");
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
        if (password.length === 0) {
            throw new BadRequestError("User cannot authenticate without a password");
        }

        this.password = password;

        return this;
    }
}