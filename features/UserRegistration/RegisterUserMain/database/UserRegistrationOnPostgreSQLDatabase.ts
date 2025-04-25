import type { QueryResult } from "pg";
import argon2 from "argon2";
import PostgreSQLDatabase from "../../../../services/database/PostgreSQLDatabase";
import RegisterUserGateway from "../../RegisterUserUseCase/RegisterUserGateway";
import UserRegistrationInput from "../../RegisterUserUseCase/UserRegistrationInput";

export default class UserRegistrationOnPostgreSQLDatabase implements RegisterUserGateway{
    private postgreSQLDatabase: PostgreSQLDatabase;

    constructor() {
        this.postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    }

    public async registerUser(userRegistrationInput: UserRegistrationInput): Promise<boolean>
    {
        const hashedPassword: string = await argon2.hash(userRegistrationInput.getPassword());
        const queryResult: QueryResult|undefined = await this.postgreSQLDatabase.query(
            "INSERT INTO application_users (email, username, password, firstname, lastname) VALUES ($1, $2, $3, $4, $5)",
            [userRegistrationInput.getEmail(), userRegistrationInput.getUsername(), hashedPassword, userRegistrationInput.getFirstName(), userRegistrationInput.getLastName()]
        ); 

        if (queryResult !== undefined && queryResult.rowCount !== null && queryResult.rowCount > 0) {
            return true;
        } else {
            return false;
        }
    }

    public async connect(): Promise<void> 
    {
        this.postgreSQLDatabase.connect();
    }

    public async close(): Promise<void> 
    {
        this.postgreSQLDatabase.close();
    }

    public async query(query: string, values?: Array<any>): Promise<any>
    {
        return await this.postgreSQLDatabase.query(query, values);
    }
}