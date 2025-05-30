import { app } from "./app"

const port: number = 8080;

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

export {server}