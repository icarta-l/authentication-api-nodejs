export default class RetrieveUserResponse
{
    private userId!: string;
    private username!: string;
    private email!: string;
    private firstName!: string;
    private lastName!: string;

    public getUserId(): string
    {
        return this.userId;
    }
    public setUserId(userId: string): RetrieveUserResponse
    {
        this.userId = userId;

        return this;
    }

    public getUsername(): string
    {
        return this.username;
    }

    public setUsername(username: string): RetrieveUserResponse
    {
        this.username = username;

        return this;
    }

    public getEmail(): string
    {
        return this.email;
    }

    public setEmail(email: string): RetrieveUserResponse
    {
        this.email = email;

        return this;
    }

    public getFirstName(): string
    {
        return this.firstName;
    } 

    public setFirstName(firstName: string): RetrieveUserResponse
    {
        this.firstName = firstName;

        return this;
    }

    public getLastName(): string
    {
        return this.lastName;
    }

    public setLastName(lastName: string): RetrieveUserResponse
    {
        this.lastName = lastName;

        return this;
    }
}