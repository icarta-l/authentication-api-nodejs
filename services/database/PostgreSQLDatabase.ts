import type { Client } from "pg";
import pg from "pg";

export default class PostgreSQLDatabase {
    private client!: Client;
    private static instance: PostgreSQLDatabase;
    private isConnected: boolean = false;

    public static getInstance(): PostgreSQLDatabase 
    {
        if (!PostgreSQLDatabase.instance) {
            PostgreSQLDatabase.instance = new PostgreSQLDatabase();
        }

        return PostgreSQLDatabase.instance;
    }

    public async connect(): Promise<void> 
    {
        if (this.isConnected === false) {
            this.client = new pg.Client({
                user: process.env.POSTGRES_USER,
                host: process.env.POSTGRES_HOST,
                database: process.env.POSTGRES_DB,
                password: process.env.POSTGRES_PASSWORD,
                port: Number(process.env.POSTGRES_PORT)
            });
            await this.client.connect();
            this.isConnected = true;
        }
    }

    public async query(query: string, values?: Array<any>): Promise<any>
    {
        return await this.client.query(query, values);
    }

    public async close(): Promise<void>
    {
        if (this.isConnected === true) {
            await this.client.end();
            this.isConnected = false;
        }
    }
}