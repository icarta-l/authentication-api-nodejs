import PostgreSQLDatabase from "../../../../services/database/PostgreSQLDatabase";
import argon2 from "argon2";
import type { QueryResult } from "pg";

export default class UserAuthenticationOnPostgreSQLDatabase
{
    private postgreSQLDatabase: PostgreSQLDatabase;

    constructor() {
        this.postgreSQLDatabase = PostgreSQLDatabase.getInstance();
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

    public async authenticateUser(email: string, password: string): Promise<string|false>
    {
        const queryResult: QueryResult|undefined = await this.postgreSQLDatabase.query(
            "SELECT id, password FROM application_users WHERE email = $1",
            [email]
        ); 

        if (queryResult !== undefined && queryResult.rowCount !== null && queryResult.rowCount > 0) {
            let passwordIsMatchingTheAssociatedEmailInDatabase;

            try {
                passwordIsMatchingTheAssociatedEmailInDatabase = await argon2.verify(queryResult.rows[0].password, password);
            } catch (error) {
                return false;
            }

            if (passwordIsMatchingTheAssociatedEmailInDatabase) {
                return queryResult.rows[0].id;
            } else {
                return false;
            }
            
        } else {
            return false;
        }
    }
}