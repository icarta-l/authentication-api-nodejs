import PostgreSQLDatabase from "../../../../services/database/PostgreSQLDatabase";
import User from "../../AuthenticateUserValueObject/User";
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

    public async retrieveUser(email: string): Promise<User|boolean>
    {
        const queryResult: QueryResult|undefined = await this.postgreSQLDatabase.query(
            "SELECT password FROM application_users WHERE email = $1",
            [email]
        ); 

        if (queryResult !== undefined && queryResult.rowCount !== null && queryResult.rowCount > 0) {
            const user = new User();
            user.setPassword(queryResult.password);
            
            return user;
        } else {
            return false;
        }
    }
}