import express, { Express } from 'express';
import { RegisterUserRouter } from "./features/RegisterUser/RegisterUserMain/router";
import { AuthenticateUserRouter } from './features/AuthenticateUser/AuthenticateUserMain/router';
import { RetrieveUserRouter } from './features/RetrieveUser/RetrieveUserMain/router';

const app: Express = express();

app.use("/user", RegisterUserRouter);
app.use("/user", RetrieveUserRouter);
app.use("/login", AuthenticateUserRouter);

export { app };