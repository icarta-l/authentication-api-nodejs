import type { QueryResult } from "pg";
import argon2 from "argon2";
import PostgreSQLDatabase from "../../../../services/database/PostgreSQLDatabase";

export default class UserRegistrationOnPostgreSQLDatabase {
    private postgreSQLDatabase: PostgreSQLDatabase;

    constructor() {
        this.postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    }

    public async registerUser(email: string, username: string, password: string, firstname: string|false = false, lastname: string|false = false): Promise<boolean>
    {
        const hashedPassword: string = await argon2.hash(password);
        const queryResult: QueryResult|undefined = await this.postgreSQLDatabase.query(
            "INSERT INTO application_users (email, username, password, firstname, lastname) VALUES ($1, $2, $3, $4, $5)",
            [email, username, hashedPassword, firstname, lastname]
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
}