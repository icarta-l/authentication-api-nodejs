import {afterAll, beforeAll, describe, expect, test} from "@jest/globals";
import PostgreSQLDatabase from "../../../services/database/PostgreSQLDatabase";
import "dotenv/config";
import {app} from "../../../app";
import request from "supertest";

const userEndpoint = "/user";
let userId: string;

afterAll( async () => {
    const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    await postgreSQLDatabase.connect();
    await postgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await postgreSQLDatabase.close();
});

beforeAll( async() => {
    const registerResponse = await request(app)
        .post(userEndpoint)
        .send({
            username: "UserTest",
            email: "test@gmail.com",
            password: "my Test pas SDF23sword1",
            firstName: "Lorem",
            lastName: "Ipsum"
        });

    expect(registerResponse.status).toEqual(201);

    const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    await postgreSQLDatabase.connect();
    const rawRetrievedQuery = await postgreSQLDatabase.query("SELECT id FROM application_users WHERE email = $1", ["test@gmail.com"]);
    userId = rawRetrievedQuery.rows[0].id;
    await postgreSQLDatabase.close();
});

describe("GET to user route", () => {
    test("should return a 200 HTTP response", async () => {
        const response = await request(app)
            .get(userEndpoint)
            .send({
                userId: userId
            });

        expect(response.status).toEqual(200);
    });

    test("should return user's data", async () => {
        const response = await request(app)
            .get(userEndpoint)
            .send({
                userId: userId
            });

        expect(response.body.username).toEqual("UserTest");
        expect(response.body.email).toEqual("test@gmail.com");
        expect(response.body.firstName).toEqual("Lorem");
        expect(response.body.lastName).toEqual("Ipsum");
    });
});