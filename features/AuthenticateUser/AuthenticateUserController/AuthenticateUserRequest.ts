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
        this.email = email;

        return this;
    }

    public getPassword(): string
    {
        return this.password;
    }

    public setPassword(password: string): AuthenticateUserRequest
    {
        this.password = password;

        return this;
    }
}