import express, { Express } from 'express';
import { RegisterUserRouter } from "./features/RegisterUser/RegisterUserMain/router";
import { AuthenticateUserRouter } from './features/AuthenticateUser/AuthenticateUserMain/router';
import { RetrieveUserRouter } from './features/RetrieveUser/RetrieveUserMain/router';
import { UpdateUserInformationRouter } from './features/UpdateUserInformation/UpdateUserInformationMain/router';
import { UpdateUserPasswordRouter } from './features/UpdateUserPassword/UpdateUserPasswordMain/router';

const app: Express = express();

app.use("/user", RegisterUserRouter);
app.use("/user", RetrieveUserRouter);
app.use("/user", UpdateUserInformationRouter);
app.use("/user", UpdateUserPasswordRouter);
app.use("/login", AuthenticateUserRouter);

export { app };