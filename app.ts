import express, { Express } from 'express';
import { RegisterUserRouter } from "./features/RegisterUser/RegisterUserMain/router";
import { AuthenticateUserRouter } from './features/AuthenticateUser/AuthenticateUserMain/router';

const app: Express = express();

app.use("/register", RegisterUserRouter);
app.use("/login", AuthenticateUserRouter);

export { app };