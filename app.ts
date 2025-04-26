import express, { Express } from 'express';
import {UserRegistrationRouter} from "./features/UserRegistration/RegisterUserMain/router";

const app: Express = express();
const port: number = 8080;

app.use("/register", UserRegistrationRouter);

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports.server = server;

export { app };