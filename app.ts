import express, { Express } from 'express';

const app: Express = express();
const port: number = 8080;

const userRegistrationRouter = require("./features/UserRegistration/router.ts");

app.use("/register", userRegistrationRouter);

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports.PostgreSQLDatabase = require("./features/UserRegistration/database/PostgreSQLDatabase.ts");
module.exports.server = server;