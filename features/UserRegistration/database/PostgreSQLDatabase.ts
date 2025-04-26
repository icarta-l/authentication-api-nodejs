import type { QueryResult } from "pg";

const Client = require("pg").Client;
const argon2 = require("argon2");

module.exports.default = class PostgreSQLDatabase {
    private client: typeof Client;
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
            this.client = new Client({
                user: process.env.POSTGRES_USER,
                host: process.env.POSTGRES_HOST,
                database: process.env.POSTGRES_DB,
                password: process.env.POSTGRES_PASSWORD,
                port: process.env.POSTGRES_PORT
            });
            await this.client.connect();
            this.isConnected = true;
        }
    }

    public async registerUser(email: string, username: string, password: string, firstname: string|false = false, lastname: string|false = false): Promise<boolean>
    {
        const hashedPassword: string = await argon2.hash(password);
        const queryResult: QueryResult|undefined = await this.client.query(
            "INSERT INTO application_users (email, username, password, firstname, lastname) VALUES ($1, $2, $3, $4, $5)",
            [email, username, hashedPassword, firstname, lastname]
        ); 

        if (queryResult !== undefined && queryResult.rowCount !== null && queryResult.rowCount > 0) {
            return true;
        } else {
            return false;
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