import {afterAll, beforeAll, describe, expect, test} from "@jest/globals";
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
    test("empty userId field returns a 422 HTTP response", async () => {
        const response = await request(app)
            .get(userEndpoint)
            .send({
                userId: ""
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Cannot retrieve a user without a requested user id");
        expect(response.body.code).toEqual("user_id_not_informed");
    });

    test("unrecognised user ID returns a 403 HTTP response", async () => {
        const response = await request(app)
            .get(userEndpoint)
            .send({
                userId: "1231231231223212312"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Requested user could not be retrieved");
        expect(response.body.code).toEqual("requested_user_could_not_be_retrieved");
    });

    test("malformed user ID returns a 403 HTTP response", async () => {
        const response = await request(app)
            .get(userEndpoint)
            .send({
                userId: "lsdfé*[]!,"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("User ID is not alphanumerical");
        expect(response.body.code).toEqual("user_id_not_alphanumerical");
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
        expect(response.body.message).toEqual("Retrieved username is not valid: username can only contain letters, numbers and underscores");
        expect(response.body.code).toEqual("username_has_not_allowed_characters");

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
        expect(response.body.message).toEqual("Retrieved username is not valid: username needs to have at least 3 letters");
        expect(response.body.code).toEqual("username_does_not_have_enough_letters");

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
        expect(response.body.message).toEqual("Retrieved email is not valid");
        expect(response.body.code).toEqual("retrieved_email_is_invalid");

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
        expect(response.body.message).toEqual("Retrieved first name is not valid");
        expect(response.body.code).toEqual("retrieved_first_name_is_invalid");

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
        expect(response.body.message).toEqual("Retrieved last name is not valid");
        expect(response.body.code).toEqual("retrieved_last_name_is_invalid");

        await postgreSQLDatabase.connect();
        await postgreSQLDatabase.query("UPDATE application_users SET last_name = $1 WHERE id = $2", ["Ipsum", userId]);
        await postgreSQLDatabase.close();
    });
});