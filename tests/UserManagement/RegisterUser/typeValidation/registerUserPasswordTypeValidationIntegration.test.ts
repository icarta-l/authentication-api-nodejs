import {afterAll, describe, expect, test} from "@jest/globals";
import PostgreSQLDatabase from "../../../../services/database/PostgreSQLDatabase";
import "dotenv/config";
import {app} from "../../../../app";
import request from "supertest";

const userEndpoint = "/user";

afterAll( async () => {
    const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    await postgreSQLDatabase.connect();
    await postgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await postgreSQLDatabase.close();
});

describe("Wrong password type for user retrieval feature", () => {
    test("Cannot update a user using an array as a password", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: []
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Password needs to be of type \"string\", \"array\" given");
        expect(response.body.code).toEqual("password_type_is_not_string_but_array");
    });

    test("Cannot update a user using an object as a password", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: {}
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Password needs to be of type \"string\", \"object\" given");
        expect(response.body.code).toEqual("password_type_is_not_string_but_object");
    });

    test("Cannot update a user using null as a password", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: null
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Password needs to be of type \"string\", \"null\" given");
        expect(response.body.code).toEqual("password_type_is_not_string_but_null");
    });

    test("Cannot update a user using a boolean as a password", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: true
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Password needs to be of type \"string\", \"boolean\" given");
        expect(response.body.code).toEqual("password_type_is_not_string_but_boolean");
    });

    test("Cannot update a user using undefined as a password", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: undefined
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Password needs to be of type \"string\", \"undefined\" given");
        expect(response.body.code).toEqual("password_type_is_not_string_but_undefined");
    });

    test("Cannot update a user using a number as a password", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: 1234
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Password needs to be of type \"string\", \"number\" given");
        expect(response.body.code).toEqual("password_type_is_not_string_but_number");
    });

    test("Cannot update a user using a function as a password", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: function() {}
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Password needs to be of type \"string\", \"undefined\" given");
        expect(response.body.code).toEqual("password_type_is_not_string_but_undefined");
    });

    test("Cannot update a user using a symbol as a password", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: Symbol()
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Password needs to be of type \"string\", \"undefined\" given");
        expect(response.body.code).toEqual("password_type_is_not_string_but_undefined");
    });
});