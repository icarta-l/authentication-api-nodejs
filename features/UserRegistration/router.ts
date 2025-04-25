import express, { Request, Response, Router } from 'express';
import bodyParser from 'body-parser';
import { NextHandleFunction } from 'connect';

const userRegistrationRouter: Router = express.Router();
const jsonParser: NextHandleFunction = bodyParser.json();
const PostgreSQLDatabase = require("./features/UserRegistration/database/PostgreSQLDatabase.ts");

userRegistrationRouter.post("/", jsonParser, async (request: Request, response: Response) => {
    const postgreSQLDatabase: typeof PostgreSQLDatabase = PostgreSQLDatabase.getInstance();
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