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

describe("Wrong email type for user retrieval feature", () => {
    test("Cannot update a user using an array as an email", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: []
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Email needs to be of type \"string\", \"array\" given");
        expect(response.body.code).toEqual("email_type_is_not_string_but_array");
    });

    test("Cannot update a user using an object as an email", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: {}
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Email needs to be of type \"string\", \"object\" given");
        expect(response.body.code).toEqual("email_type_is_not_string_but_object");
    });

    test("Cannot update a user using null as an email", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: null
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Email needs to be of type \"string\", \"null\" given");
        expect(response.body.code).toEqual("email_type_is_not_string_but_null");
    });

    test("Cannot update a user using a boolean as an email", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: true
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Email needs to be of type \"string\", \"boolean\" given");
        expect(response.body.code).toEqual("email_type_is_not_string_but_boolean");
    });

    test("Cannot update a user using undefined as an email", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: undefined
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Email needs to be of type \"string\", \"undefined\" given");
        expect(response.body.code).toEqual("email_type_is_not_string_but_undefined");
    });

    test("Cannot update a user using a number as an email", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: 1234
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Email needs to be of type \"string\", \"number\" given");
        expect(response.body.code).toEqual("email_type_is_not_string_but_number");
    });

    test("Cannot update a user using a function as an email", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: function() {}
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Email needs to be of type \"string\", \"undefined\" given");
        expect(response.body.code).toEqual("email_type_is_not_string_but_undefined");
    });

    test("Cannot update a user using a symbol as an email", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: Symbol()
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Email needs to be of type \"string\", \"undefined\" given");
        expect(response.body.code).toEqual("email_type_is_not_string_but_undefined");
    });
});