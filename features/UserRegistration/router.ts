import express from 'express';
import type { Request, Response, Router } from 'express';
import bodyParser from 'body-parser';
import type { NextHandleFunction } from "connect";
import PostgreSQLDatabase from "./database/PostgreSQLDatabase";

const userRegistrationRouter: Router = express.Router();
const jsonParser: NextHandleFunction = bodyParser.json();

userRegistrationRouter.post("/", jsonParser, async (request: Request, response: Response) => {
    const postgreSQLDatabase: PostgreSQLDatabase = PostgreSQLDatabase.getInstance();
    await postgreSQLDatabase.connect();
    const userRegistered: boolean = await postgreSQLDatabase.registerUser(request.body.email, request.body.username, request.body.password, request.body.firstname, request.body.lastname);
    await postgreSQLDatabase.close();

    if (userRegistered) {
        response.status(201)
        .json("User Registered!");
    } else {
        response.status(409)
        .json("User couldn't be registered");
    }
});

module.exports = userRegistrationRouter;