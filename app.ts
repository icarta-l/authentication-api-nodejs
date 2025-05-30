import express, { Express } from 'express';
import {RegisterUserRouter} from "./features/RegisterUser/RegisterUserMain/router";

const app: Express = express();
const port: number = 8080;

app.use("/register", RegisterUserRouter);

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports.server = server;

export { app };