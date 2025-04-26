import {afterAll, describe, expect, test} from '@jest/globals';
import axios from 'axios';

const PostgreSQLDatabase = require("app.ts").PostgreSQLDatabase.default;
const server = require("app.ts").server;

afterAll(async() => {
    const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    await postgreSQLDatabase.connect();
    await postgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await postgreSQLDatabase.close();
    await server.close();
});

describe("POST to register route", () => {
    test("should return a 201 HTTP response", async () => {
        const response = await axios.post("http://localhost:8080/register", {
            username: "UserTest",
            email: "test@gmail.com",
            password: "my Test password1",
            firstname: "Lorem",
            lastname: "Ipsum"
        })
        expect(response.status).toEqual(201);
    })
});