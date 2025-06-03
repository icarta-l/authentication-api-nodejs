export default class User
{
    private password!: string;

    public getPassword(): string
    {
        return this.password;
    }

    public setPassword(password: string): User
    {
        this.password = password;

        return this;
    }
}