import express, { Express } from 'express';

const app: Express = express();
const port: number = 8080;

const userRegistrationRouter = require("./features/UserRegistration/router");

app.use("/register", userRegistrationRouter);

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports.PostgreSQLDatabase = require("./features/UserRegistration/database/PostgreSQLDatabase");
module.exports.server = server;