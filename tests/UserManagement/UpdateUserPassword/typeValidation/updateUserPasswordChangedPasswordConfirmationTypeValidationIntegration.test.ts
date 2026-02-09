import {afterAll, beforeAll, describe, expect, test} from "@jest/globals";
import PostgreSQLDatabase from "../../../../services/database/PostgreSQLDatabase";
import "dotenv/config";
import {app} from "../../../../app";
import request from "supertest";

const userEndpoint = "/user";
const userPasswordEndpoint = "/user/password";
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

describe("Wrong changed password confirmation type for user password update", () => {
    test("Cannot update a user's password using an array as a changed password confirmation", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1"
            });

        const response = await request(app)
            .put(userPasswordEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: userId,
                originalPassword: "my Test pas SDF23sword1",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: []
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Changed password confirmation needs to be of type \"string\", \"array\" given");
        expect(response.body.code).toEqual("changed_password_confirmation_type_is_not_string_but_array");
    });

    test("Cannot update a user's password using an object as a changed password confirmation", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1"
            });

        const response = await request(app)
            .put(userPasswordEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: userId,
                originalPassword: "my Test pas SDF23sword1",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: {}
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Changed password confirmation needs to be of type \"string\", \"object\" given");
        expect(response.body.code).toEqual("changed_password_confirmation_type_is_not_string_but_object");
    });

    test("Cannot update a user's password using null as a changed password confirmation", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1"
            });

        const response = await request(app)
            .put(userPasswordEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: userId,
                originalPassword: "my Test pas SDF23sword1",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: null
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Changed password confirmation needs to be of type \"string\", \"null\" given");
        expect(response.body.code).toEqual("changed_password_confirmation_type_is_not_string_but_null");
    });

    test("Cannot update a user's password using a boolean as a changed password confirmation", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1"
            });

        const response = await request(app)
            .put(userPasswordEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: userId,
                originalPassword: "my Test pas SDF23sword1",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: true
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Changed password confirmation needs to be of type \"string\", \"boolean\" given");
        expect(response.body.code).toEqual("changed_password_confirmation_type_is_not_string_but_boolean");
    });

    test("Cannot update a user's password using undefined as a changed password confirmation", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1"
            });

        const response = await request(app)
            .put(userPasswordEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: userId,
                originalPassword: "my Test pas SDF23sword1",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: undefined
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Changed password confirmation needs to be of type \"string\", \"undefined\" given");
        expect(response.body.code).toEqual("changed_password_confirmation_type_is_not_string_but_undefined");
    });

    test("Cannot update a user's password using a number as a changed password confirmation", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1"
            });

        const response = await request(app)
            .put(userPasswordEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: userId,
                originalPassword: "my Test pas SDF23sword1",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: 1234
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Changed password confirmation needs to be of type \"string\", \"number\" given");
        expect(response.body.code).toEqual("changed_password_confirmation_type_is_not_string_but_number");
    });

    test("Cannot update a user's password using a function as a changed password confirmation", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1"
            });

        const response = await request(app)
            .put(userPasswordEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: userId,
                originalPassword: "my Test pas SDF23sword1",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: function() {}
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Changed password confirmation needs to be of type \"string\", \"undefined\" given");
        expect(response.body.code).toEqual("changed_password_confirmation_type_is_not_string_but_undefined");
    });

    test("Cannot update a user's password using a symbol as a changed password confirmation", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1"
            });

        const response = await request(app)
            .put(userPasswordEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: userId,
                originalPassword: "my Test pas SDF23sword1",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: Symbol()
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Changed password confirmation needs to be of type \"string\", \"undefined\" given");
        expect(response.body.code).toEqual("changed_password_confirmation_type_is_not_string_but_undefined");
    });
});