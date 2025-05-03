import {afterAll, describe, expect, test} from '@jest/globals';
import axios from 'axios';
import PostgreSQLDatabase from "../services/database/PostgreSQLDatabase";
import "dotenv/config";

const server = require("app.ts").server;
const registerEndpoint = "http://localhost:8080/register";

afterAll(async() => {
    const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    await postgreSQLDatabase.connect();
    await postgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await postgreSQLDatabase.close();
    await server.close();
});

describe("POST to register route", () => {
    test("should return a 201 HTTP response", async () => {
        const response = await axios.post(registerEndpoint, {
            username: "UserTest",
            email: "test@gmail.com",
            password: "my Test password1",
            firstname: "Lorem",
            lastname: "Ipsum"
        })
        expect(response.status).toEqual(201);
    });

    test("empty username field returns a 422 HTTP response", async () => {
        axios.post(registerEndpoint, {
            username: "",
            email: "test@gmail.com",
            password: "my Test password1",
            firstname: "Lorem",
            lastname: "Ipsum"
        })
        .catch((error) => {
            if (error.response) {
                expect(error.response.status).toEqual(422);
            }
        })
    });
});