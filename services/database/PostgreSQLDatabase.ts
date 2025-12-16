import type { Client, QueryResult } from "pg";
import pg from "pg";

export default class PostgreSQLDatabase {
    private client!: Client;
    private static instance: PostgreSQLDatabase;
    private _isConnected: boolean = false;

    public static getInstance(): PostgreSQLDatabase 
    {
        if (!PostgreSQLDatabase.instance) {
            PostgreSQLDatabase.instance = new PostgreSQLDatabase();
        }

        return PostgreSQLDatabase.instance;
    }

    public async connect(): Promise<void> 
    {
        if (this._isConnected === false) {
            this.client = new pg.Client({
                user: process.env.POSTGRES_USER,
                host: process.env.POSTGRES_HOST,
                database: process.env.POSTGRES_DB,
                password: process.env.POSTGRES_PASSWORD,
                port: Number(process.env.POSTGRES_PORT)
            });

            await this.client.connect();
            this._isConnected = true;
        }
    }

    public async query(query: string, values?: Array<any>): Promise<any>
    {
        return await this.client.query(query, values);
    }

    public async close(): Promise<void>
    {
        if (this._isConnected === true) {
            await this.client.end();
            this._isConnected = false;
        }
    }

    public async getUserRole(userId: string): Promise<string|false>
    {
        const queryResult: QueryResult|undefined = await this.client.query(
            "SELECT role FROM application_users WHERE id = $1",
            [userId]
        );

        if (queryResult !== undefined && queryResult.rowCount !== null && queryResult.rowCount > 0) {
            switch(queryResult.rows[0].role) {
                case "USER_ROLE":
                    return "User";
                
                default:
                    return false;
            }
        } else {
            return false;
        }
    }
}