import express, { Express } from 'express';
import { RegisterUserRouter } from "./features/RegisterUser/RegisterUserMain/router";
import { AuthenticateUserRouter } from './features/AuthenticateUser/AuthenticateUserMain/router';

const app: Express = express();
const port: number = 8080;

app.use("/register", RegisterUserRouter);
app.use("/login", AuthenticateUserRouter);

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports.server = server;

export { app };