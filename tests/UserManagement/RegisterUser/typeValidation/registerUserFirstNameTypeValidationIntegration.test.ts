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

describe("Wrong first name type for user retrieval feature", () => {
    test("Cannot update a user using an array as a first name", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: "sdfsd",
                firstName: []
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("First name needs to be of type \"string\", \"array\" given");
        expect(response.body.code).toEqual("first_name_type_is_not_string_but_array");
    });

    test("Cannot update a user using an object as a first name", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: "sdfsd",
                firstName: {}
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("First name needs to be of type \"string\", \"object\" given");
        expect(response.body.code).toEqual("first_name_type_is_not_string_but_object");
    });

    test("Cannot update a user using a boolean as a first name", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: "sdfsd",
                firstName: true
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("First name needs to be of type \"string\", \"boolean\" given");
        expect(response.body.code).toEqual("first_name_type_is_not_string_but_boolean");
    });

    test("Cannot update a user using a number as a first name", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                email: "sdf",
                username: "toto",
                password: "sdfsd",
                firstName: 1234
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("First name needs to be of type \"string\", \"number\" given");
        expect(response.body.code).toEqual("first_name_type_is_not_string_but_number");
    });
});