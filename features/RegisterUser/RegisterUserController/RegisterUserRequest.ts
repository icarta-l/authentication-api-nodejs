import BadRequestError from "../../../services/errors/BadRequestError";
import RegisterUserTypeValidation from "./RegisterUserTypeValidation";

export default class RegisterUserRequest 
{
    private username!: string;
    private email!: string;
    private password!: string;
    private firstName!: string;
    private lastName!: string;
    private registerUserTypeValidation: RegisterUserTypeValidation
            
    constructor(registerUserTypeValidation: RegisterUserTypeValidation)
    {
        this.registerUserTypeValidation = registerUserTypeValidation;
    }

    public getUsername(): string
    {
        return this.username;
    }

    public setUsername(username: string): RegisterUserRequest
    {
        this.registerUserTypeValidation.isString(username, "Username");

        if (username.length === 0) {
            throw new BadRequestError("User cannot register without a username", "username_not_informed");
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
        this.registerUserTypeValidation.isString(email, "Email");

        if (email.length === 0) {
            throw new BadRequestError("User cannot register without an email", "email_not_informed");
        }

        this.email = email;

        return this;
    }

    public getPassword(): string
    {
        return this.password;
    }

    public setPassword(password: string): RegisterUserRequest
    {
        this.registerUserTypeValidation.isString(password, "Password");

        if (password.length === 0) {
            throw new BadRequestError("User cannot register without a password", "password_not_informed");
        }

        this.password = password;

        return this;
    }

    public getFirstName(): string
    {
        return this.firstName;
    }

    public setFirstName(firstName: string): RegisterUserRequest
    {
        this.registerUserTypeValidation.isString(firstName, "First name");

        this.firstName = firstName;

        return this;
    }

    public getLastName(): string
    {
        return this.lastName;
    }

    public setLastName(lastName: string): RegisterUserRequest
    {
        this.registerUserTypeValidation.isString(lastName, "Last name");

        this.lastName = lastName;

        return this;
    }
}