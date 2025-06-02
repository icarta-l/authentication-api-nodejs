export default class UserAuthenticationInput
{
    private email!: string;
    private password!: string;

    public getEmail(): string
    {
        return this.email;
    }

    public setEmail(email: string): UserAuthenticationInput
    {
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