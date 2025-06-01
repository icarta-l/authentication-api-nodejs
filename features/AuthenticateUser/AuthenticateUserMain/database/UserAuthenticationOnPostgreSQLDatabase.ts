import PostgreSQLDatabase from "../../../../services/database/PostgreSQLDatabase";

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
}