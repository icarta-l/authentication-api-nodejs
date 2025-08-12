import {afterAll, describe, expect, test} from "@jest/globals";
import PostgreSQLDatabase from "../../services/database/PostgreSQLDatabase";
import "dotenv/config";
import {app} from "../../app";
import request from "supertest";

const userEndpoint = "/user";
let userId: string;

afterAll( async () => {
    const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    await postgreSQLDatabase.connect();
    await postgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await postgreSQLDatabase.close();
});

describe("GET to user route", () => {
    test("should return a 200 HTTP response", async () => {
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

    test("empty userId field returns a 422 HTTP response", async () => {
        const response = await request(app)
            .get(userEndpoint)
            .send({
                userId: ""
            });

        expect(response.status).toEqual(422);
    });

    test("unrecognised user ID returns a 403 HTTP response", async () => {
        const response = await request(app)
            .get(userEndpoint)
            .send({
                userId: "1231231231223212312"
            });

        expect(response.status).toEqual(403);
    });

    test("malformed user ID returns a 403 HTTP response", async () => {
        const response = await request(app)
            .get(userEndpoint)
            .send({
                userId: "lsdfé*[]!,"
            });

        expect(response.status).toEqual(403);
    });

    test("username with special characters returns a 500 HTTP response", async () => {
        const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
        await postgreSQLDatabase.connect();
        await postgreSQLDatabase.query("UPDATE application_users SET username = $1 WHERE id = $2", ["lae[asdf]*", userId]);
        await postgreSQLDatabase.close();

        const response = await request(app)
            .get(userEndpoint)
            .send({
                userId: userId
            });

        expect(response.status).toEqual(500);

        await postgreSQLDatabase.connect();
        await postgreSQLDatabase.query("UPDATE application_users SET username = $1 WHERE id = $2", ["UserTest", userId]);
        await postgreSQLDatabase.close();
    });

    test("fully numerical username returns a 500 HTTP response", async () => {
        const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
        await postgreSQLDatabase.connect();
        await postgreSQLDatabase.query("UPDATE application_users SET username = $1 WHERE id = $2", ["123123123", userId]);
        await postgreSQLDatabase.close();

        const response = await request(app)
            .get(userEndpoint)
            .send({
                userId: userId
            });

        expect(response.status).toEqual(500);

        await postgreSQLDatabase.connect();
        await postgreSQLDatabase.query("UPDATE application_users SET username = $1 WHERE id = $2", ["UserTest", userId]);
        await postgreSQLDatabase.close();
    });

    test("invalid email returns a 500 HTTP response", async () => {
        const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
        await postgreSQLDatabase.connect();
        await postgreSQLDatabase.query("UPDATE application_users SET email = $1 WHERE id = $2", ["test.wrong@bloblbo.beark13", userId]);
        await postgreSQLDatabase.close();

        const response = await request(app)
            .get(userEndpoint)
            .send({
                userId: userId
            });

        expect(response.status).toEqual(500);

        await postgreSQLDatabase.connect();
        await postgreSQLDatabase.query("UPDATE application_users SET email = $1 WHERE id = $2", ["test@gmail.com", userId]);
        await postgreSQLDatabase.close();
    });

    test("invalid first name returns a 500 HTTP response", async () => {
        const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
        await postgreSQLDatabase.connect();
        await postgreSQLDatabase.query("UPDATE application_users SET first_name = $1 WHERE id = $2", ["123324234", userId]);
        await postgreSQLDatabase.close();

        const response = await request(app)
            .get(userEndpoint)
            .send({
                userId: userId
            });

        expect(response.status).toEqual(500);

        await postgreSQLDatabase.connect();
        await postgreSQLDatabase.query("UPDATE application_users SET first_name = $1 WHERE id = $2", ["Lorem", userId]);
        await postgreSQLDatabase.close();
    });

    test("invalid last name returns a 500 HTTP response", async () => {
        const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
        await postgreSQLDatabase.connect();
        await postgreSQLDatabase.query("UPDATE application_users SET last_name = $1 WHERE id = $2", ["123324234", userId]);
        await postgreSQLDatabase.close();

        const response = await request(app)
            .get(userEndpoint)
            .send({
                userId: userId
            });

        expect(response.status).toEqual(500);

        await postgreSQLDatabase.connect();
        await postgreSQLDatabase.query("UPDATE application_users SET last_name = $1 WHERE id = $2", ["Ipsum", userId]);
        await postgreSQLDatabase.close();
    });
});