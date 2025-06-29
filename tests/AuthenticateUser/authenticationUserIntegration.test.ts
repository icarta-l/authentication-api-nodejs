import {afterAll, describe, expect, test} from '@jest/globals';
import axios from 'axios';
import PostgreSQLDatabase from "../../services/database/PostgreSQLDatabase";
import "dotenv/config";

const server = require("app.ts").server;
const registerEndpoint = "http://localhost:8080/register";
const autenticationEndpoint = "http://localhost:8080/login";

afterAll(async() => {
    const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    await postgreSQLDatabase.connect();
    await postgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await postgreSQLDatabase.close();
    await server.close();
});

describe("POST to authentication route", () => {
    test("should return a 200 HTTP response", async () => {
        const registrationResponse = await axios.post(registerEndpoint, {
            username: "UserTest",
            email: "test@gmail.com",
            password: "my Test pas SDF23sword1",
            firstName: "Lorem",
            lastName: "Ipsum"
        });

        const authenticationResponse = await axios.post(autenticationEndpoint, {
            email: "test@gmail.com",
            password: "my Test pas SDF23sword1"
        });

        expect(authenticationResponse.status).toEqual(200);
    });
});