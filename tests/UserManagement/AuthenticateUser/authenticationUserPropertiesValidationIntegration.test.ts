import {afterAll, beforeAll, describe, expect, test} from '@jest/globals';
import PostgreSQLDatabase from "../../../services/database/PostgreSQLDatabase";
import "dotenv/config";
import {app} from "../../../app";
import request from "supertest";

const registerEndpoint = "/user";
const autenticationEndpoint = "/login";

afterAll(async() => {
    const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    await postgreSQLDatabase.connect();
    await postgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await postgreSQLDatabase.close();
});

beforeAll(async() => {
    await request(app)
        .post(registerEndpoint)
        .send({
            username: "UserTest",
            email: "test@gmail.com",
            password: "my Test pas SDF23sword1",
            firstName: "Lorem",
            lastName: "Ipsum"
        });
});

describe("POST to authentication route", () => {
    test("empty email should return a 422 HTTP code", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "",
                password: "my Test pas SDF23sword1"
            });

        expect(authenticationResponse.status).toEqual(422);
    });

    test("empty password should return a 422 HTTP code", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: ""
            });

        expect(authenticationResponse.status).toEqual(422);
    });

    test("invalid email should return a 403 HTTP code", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.c",
                password: "my Test pas SDF23sword1"
            });

        expect(authenticationResponse.status).toEqual(403);
    });
});