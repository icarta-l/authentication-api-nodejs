import BadRequestError from "../../../services/errors/BadRequestError";

export default class RegisterUserRequest 
{
    private username!: string;
    private email!: string;
    private password!: string;
    private firstName!: string;
    private lastName!: string;

    public getUsername(): string
    {
        return this.username;
    }

    public setUsername(username: string): RegisterUserRequest
    {
        if (username.length === 0) {
            throw new BadRequestError("User cannot register without a username");
        }
        
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

    public getFirstName(): string
    {
        return this.firstName;
    }

    public setFirstName(firstName: string): RegisterUserRequest
    {
        this.firstName = firstName;

        return this;
    }

    public getLastName(): string
    {
        return this.lastName;
    }

    public setLastName(lastName: string): RegisterUserRequest
    {
        this.lastName = lastName;

        return this;
    }
}