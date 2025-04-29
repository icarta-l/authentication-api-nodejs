export default class RegisterUserRequest 
{
    private username!: string;
    private email!: string;
    private password!: string;
    private firstname!: string;
    private lastname!: string;

    public getUsername(): string
    {
        return this.username;
    }

    public setUsername(username: string): RegisterUserRequest
    {
        this.username = username;

        return this;
    }

    public getEmail(): string
    {
        return this.email;
    }

    public setEmail(email: string): RegisterUserRequest
    {
        this.email = email;

        return this;
    }

    public getPassword(): string
    {
        return this.password;
    }

    public setPassword(password: string): RegisterUserRequest
    {
        this.password = password;

        return this;
    }

    public getFirstname(): string
    {
        return this.firstname;
    }

    public setFirstname(firstname: string): RegisterUserRequest
    {
        this.firstname = firstname;

        return this;
    }

    public getLastname(): string
    {
        return this.lastname;
    }

    public setLastname(lastname: string): RegisterUserRequest
    {
        this.lastname = lastname;

        return this;
    }
}