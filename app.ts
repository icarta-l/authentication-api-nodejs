import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { NextHandleFunction } from "connect";

const app: Express = express();
const port: number = 8080;
const Client = require("pg").Client;

class PostgreSQLDatabase {
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
            console.log("COnnected");
            this.isConnected = true;
        }
    }

    public async close(): Promise<void>
    {
        if (this.isConnected === true) {
            await this.client.end();
            console.log("Closed");
            this.isConnected = false;
        }
    }
}

const jsonParser: NextHandleFunction = bodyParser.json();

app.post("/register", jsonParser, async (request: Request, response: Response) => {
    console.log(request.body);
    let database = PostgreSQLDatabase.getInstance();
    await database.connect();
    console.log("Befre response is sent!");
    await database.close();
    response.send("Hello World!");
});

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports.App = app;
module.exports.Server = server;
module.exports.Database = PostgreSQLDatabase;