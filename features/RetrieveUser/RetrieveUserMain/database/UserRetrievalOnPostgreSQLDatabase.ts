import PostgreSQLDatabase from "../../../../services/database/PostgreSQLDatabase";
import type { QueryResult } from "pg";

export default class UserRetrievalOnPostgreSQLDatabase
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
}