import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { NextHandleFunction } from "connect";

const app: Express = express();
const port: number = 8080;
const client = require("pg").Client;

const myFunction = async () => {
    const customClient = new client({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT,
    });
    console.log("Here");
    await customClient.connect();
    console.log("Connected to PostGreSQL!");
    await customClient.end();
    console.log("Closed");
}

const jsonParser: NextHandleFunction = bodyParser.json();

app.post("/register", jsonParser, async (request: Request, response: Response) => {
    console.log(request.body);
    await myFunction();
    response.send("Hello World!");
});

const server = app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports.App = app;
module.exports.Server = server;