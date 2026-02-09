import express, { Express } from 'express';
import { RegisterUserRouter } from "./features/UserManagement/RegisterUser/RegisterUserMain/router";
import { AuthenticateUserRouter } from './features/UserManagement/AuthenticateUser/AuthenticateUserMain/router';
import { RetrieveUserRouter } from './features/UserManagement/RetrieveUser/RetrieveUserMain/router';
import { UpdateUserInformationRouter } from './features/UserManagement/UpdateUserInformation/UpdateUserInformationMain/router';
import { UpdateUserPasswordRouter } from './features/UserManagement/UpdateUserPassword/UpdateUserPasswordMain/router';

const app: Express = express();

app.use("/user", RegisterUserRouter);
app.use("/user", RetrieveUserRouter);
app.use("/user", UpdateUserInformationRouter);
app.use("/user", UpdateUserPasswordRouter);
app.use("/login", AuthenticateUserRouter);

export { app };