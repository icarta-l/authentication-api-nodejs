import {afterAll, beforeAll, describe, expect, test} from "@jest/globals";
import PostgreSQLDatabase from "../../services/database/PostgreSQLDatabase";
import "dotenv/config";
import {app} from "../../app";
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

beforeAll( async () => {
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

describe("PUT to user route", () => {
    test("Cannot update a user without an updated user Id", async () => {
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
                updatedUserId: ""
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Cannot update a user without an updated user id");
        expect(response.body.code).toEqual("updated_user_id_not_informed");
    });

    test("Cannot update a user without a first name", async () => {
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
                updatedUserId: userId,
                firstName: ""
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Cannot update a user without a first name");
        expect(response.body.code).toEqual("first_name_not_informed");
    });

    test("Cannot update a user without a last name", async () => {
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
                updatedUserId: userId,
                firstName: "Bob",
                lastName: ""
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Cannot update a user without a last name");
        expect(response.body.code).toEqual("last_name_not_informed");
    });

    test("Cannot update a user with an updated user ID that is not alphanumerical", async () => {
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
                updatedUserId: "lsdfé*[]!,",
                firstName: "Bob",
                lastName: "Bobby"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Updated User ID is not alphanumerical");
        expect(response.body.code).toEqual("updated_user_id_not_alphanumerical");
    });

    test("Cannot update a user with a first name that has non-letters characters", async () => {
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
                updatedUserId: userId,
                firstName: "Bob_123",
                lastName: "Bobby"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("First name must be letters only");
        expect(response.body.code).toEqual("first_name_not_letters_only");
    });

    test("Cannot update a user with a last name that has non-letters characters", async () => {
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
                updatedUserId: userId,
                firstName: "Bob",
                lastName: "Bobby_123"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Last name must be letters only");
        expect(response.body.code).toEqual("last_name_not_letters_only");
    });
});