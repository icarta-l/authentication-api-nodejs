import {afterAll, beforeAll, describe, expect, test} from "@jest/globals";
import PostgreSQLDatabase from "../../../services/database/PostgreSQLDatabase";
import "dotenv/config";
import {app} from "../../../app";
import request from "supertest";

const userEndpoint = "/user";
const autenticationEndpoint = "/login";

let userId: string;

afterAll( async () => {
    const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    await postgreSQLDatabase.connect();
    await postgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await postgreSQLDatabase.close();
});

beforeAll(async() => {
    const registerResponse = await request(app)
        .post(userEndpoint)
        .send({
            username: "UserTest",
            email: "test@gmail.com",
            password: "my Test pas SDF23sword1",
            firstName: "Lorem",
            lastName: "Ipsum"
        });

    const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    await postgreSQLDatabase.connect();
    const rawRetrievedQuery = await postgreSQLDatabase.query("SELECT id FROM application_users WHERE email = $1", ["test@gmail.com"]);
    userId = rawRetrievedQuery.rows[0].id;
    await postgreSQLDatabase.close();
});

describe("Wrong updated user id type for user update", () => {
    test("Cannot update a user using an array as an updated user id", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1"
            });

        const response = await request(app)
            .put(userEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: [],
                firstName: "Foo",
                lastName: "Bar"
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Updated user id needs to be of type \"string\", \"array\" given");
        expect(response.body.code).toEqual("updated_user_id_type_is_not_string_but_array");
    });

    test("Cannot update a user using an object as an updated user id", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1"
            });

        const response = await request(app)
            .put(userEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: {},
                firstName: "Foo",
                lastName: "Bar"
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Updated user id needs to be of type \"string\", \"object\" given");
        expect(response.body.code).toEqual("updated_user_id_type_is_not_string_but_object");
    });

    test("Cannot update a user using null as an updated user id", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1"
            });

        const response = await request(app)
            .put(userEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: null,
                firstName: "Foo",
                lastName: "Bar"
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Updated user id needs to be of type \"string\", \"null\" given");
        expect(response.body.code).toEqual("updated_user_id_type_is_not_string_but_null");
    });

    test("Cannot update a user using a boolean as an updated user id", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1"
            });

        const response = await request(app)
            .put(userEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: true,
                firstName: "Foo",
                lastName: "Bar"
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Updated user id needs to be of type \"string\", \"boolean\" given");
        expect(response.body.code).toEqual("updated_user_id_type_is_not_string_but_boolean");
    });

    test("Cannot update a user using undefined as an updated user id", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1"
            });

        const response = await request(app)
            .put(userEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: undefined,
                firstName: "Foo",
                lastName: "Bar"
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Updated user id needs to be of type \"string\", \"undefined\" given");
        expect(response.body.code).toEqual("updated_user_id_type_is_not_string_but_undefined");
    });

    test("Cannot update a user using a number as an updated user id", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1"
            });

        const response = await request(app)
            .put(userEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: 1234,
                firstName: "Foo",
                lastName: "Bar"
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Updated user id needs to be of type \"string\", \"number\" given");
        expect(response.body.code).toEqual("updated_user_id_type_is_not_string_but_number");
    });

    test("Cannot update a user using a function as an updated user id", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1"
            });

        const response = await request(app)
            .put(userEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: function() {},
                firstName: "Foo",
                lastName: "Bar"
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Updated user id needs to be of type \"string\", \"undefined\" given");
        expect(response.body.code).toEqual("updated_user_id_type_is_not_string_but_undefined");
    });

    test("Cannot update a user using a symbol as an updated user id", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1"
            });

        const response = await request(app)
            .put(userEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: Symbol(),
                firstName: "Foo",
                lastName: "Bar"
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Updated user id needs to be of type \"string\", \"undefined\" given");
        expect(response.body.code).toEqual("updated_user_id_type_is_not_string_but_undefined");
    });
});