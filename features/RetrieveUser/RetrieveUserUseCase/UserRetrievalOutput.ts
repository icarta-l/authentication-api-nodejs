export default class UserRetrievalOutput
{
    private userId!: string
    private username!: string
    private email!: string
    private firstName!: string
    private lastName!: string

    public getUserId(): string
    {
        return this.userId;
    }

    public setUserId(userId: string): UserRetrievalOutput
    {
        this.userId = userId;

        return this;
    }

    public getUsername(): string
    {
        return this.username;
    }

    public setUsername(username: string): UserRetrievalOutput
    {
        this.username = username;

        return this;
    }

    public getEmail(): string
    {
        return this.email;
    }

    public setEmail(email: string): UserRetrievalOutput
    {
        this.email = email;

        return this;
    }

    public getFirstName(): string
    {
        return this.firstName;
    }

    public setFirstName(firstName: string): UserRetrievalOutput
    {
        this.firstName = firstName;

        return this;
    }

    public getLastName(): string
    {
        return this.lastName;
    }

    public setLastName(lastName: string): UserRetrievalOutput
    {
        this.lastName = lastName;

        return this;
    }
}