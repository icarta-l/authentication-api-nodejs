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

describe("Wrong last name type for user retrieval feature", () => {
    test("Cannot update a user using an array as a last name", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: "sdfsd",
                firstName: "bobo",
                lastName: []
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Last name needs to be of type \"string\", \"array\" given");
        expect(response.body.code).toEqual("last_name_type_is_not_string_but_array");
    });

    test("Cannot update a user using an object as a last name", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: "sdfsd",
                firstName: "bobo",
                lastName: {}
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Last name needs to be of type \"string\", \"object\" given");
        expect(response.body.code).toEqual("last_name_type_is_not_string_but_object");
    });

    test("Cannot update a user using null as a last name", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: "sdfsd",
                firstName: "bobo",
                lastName: null
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Last name needs to be of type \"string\", \"null\" given");
        expect(response.body.code).toEqual("last_name_type_is_not_string_but_null");
    });

    test("Cannot update a user using a boolean as a last name", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: "sdfsd",
                firstName: "bobo",
                lastName: true
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Last name needs to be of type \"string\", \"boolean\" given");
        expect(response.body.code).toEqual("last_name_type_is_not_string_but_boolean");
    });

    test("Cannot update a user using undefined as a last name", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: "sdfsd",
                firstName: "bobo",
                lastName: undefined
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Last name needs to be of type \"string\", \"undefined\" given");
        expect(response.body.code).toEqual("last_name_type_is_not_string_but_undefined");
    });

    test("Cannot update a user using a number as a last name", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: "sdfsd",
                firstName: "bobo",
                lastName: 1234
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Last name needs to be of type \"string\", \"number\" given");
        expect(response.body.code).toEqual("last_name_type_is_not_string_but_number");
    });

    test("Cannot update a user using a function as a last name", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: "sdfsd",
                firstName: "bobo",
                lastName: function() {}
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Last name needs to be of type \"string\", \"undefined\" given");
        expect(response.body.code).toEqual("last_name_type_is_not_string_but_undefined");
    });

    test("Cannot update a user using a symbol as a last name", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: "sdfsd",
                firstName: "bobo",
                lastName: Symbol()
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Last name needs to be of type \"string\", \"undefined\" given");
        expect(response.body.code).toEqual("last_name_type_is_not_string_but_undefined");
    });
});