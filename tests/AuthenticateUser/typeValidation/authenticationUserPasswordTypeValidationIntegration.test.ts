import {afterAll, beforeAll, describe, expect, test} from "@jest/globals";
import PostgreSQLDatabase from "../../../services/database/PostgreSQLDatabase";
import "dotenv/config";
import {app} from "../../../app";
import request from "supertest";

const autenticationEndpoint = "/login";

afterAll( async () => {
    const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    await postgreSQLDatabase.connect();
    await postgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await postgreSQLDatabase.close();
});

describe("Wrong password type for user authentication", () => {
    test("Cannot authenticate a user using an array as a password", async () => {
        const response = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: []
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Password needs to be of type \"string\", \"array\" given");
        expect(response.body.code).toEqual("password_type_is_not_string_but_array");
    });

    test("Cannot authenticate a user using an object as a password", async () => {
        const response = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: {}
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Password needs to be of type \"string\", \"object\" given");
        expect(response.body.code).toEqual("password_type_is_not_string_but_object");
    });

    test("Cannot authenticate a user using null as a password", async () => {
        const response = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: null
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Password needs to be of type \"string\", \"null\" given");
        expect(response.body.code).toEqual("password_type_is_not_string_but_null");
    });

    test("Cannot authenticate a user using a boolean as a password", async () => {
        const response = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: true
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Password needs to be of type \"string\", \"boolean\" given");
        expect(response.body.code).toEqual("password_type_is_not_string_but_boolean");
    });

    test("Cannot authenticate a user using undefined as a password", async () => {
        const response = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: undefined
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Password needs to be of type \"string\", \"undefined\" given");
        expect(response.body.code).toEqual("password_type_is_not_string_but_undefined");
    });

    test("Cannot authenticate a user using a number as a password", async () => {
        const response = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: 12345
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Password needs to be of type \"string\", \"number\" given");
        expect(response.body.code).toEqual("password_type_is_not_string_but_number");
    });

    test("Cannot authenticate a user using a function as a password", async () => {
        const response = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: function() {}
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Password needs to be of type \"string\", \"undefined\" given");
        expect(response.body.code).toEqual("password_type_is_not_string_but_undefined");
    });

    test("Cannot authenticate a user using a symbol as a password", async () => {
        const response = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: Symbol()
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Password needs to be of type \"string\", \"undefined\" given");
        expect(response.body.code).toEqual("password_type_is_not_string_but_undefined");
    });
});