import {afterAll, describe, expect, test} from "@jest/globals";
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

describe("PUT to user route", () => {
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
                firstName: "Foo",
                lastName: "Bar"
            });

        expect(response.status).toEqual(200);
    });

    test("User retrieved information match after update", async () => {
        const response = await request(app)
            .get(userEndpoint)
            .send({
                userId: userId
            });
        
        expect(response.body.username).toEqual("UserTest");
        expect(response.body.email).toEqual("test@gmail.com");
        expect(response.body.firstName).toEqual("Foo");
        expect(response.body.lastName).toEqual("Bar");
    });

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
    });

    test("Cannot update a user if user role is not recognised", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1"
            });

        const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
        await postgreSQLDatabase.connect();
        await postgreSQLDatabase.query("UPDATE application_users SET role = 'sdfasdfasd' WHERE id = $1", [userId]);
        await postgreSQLDatabase.close();

        const response = await request(app)
            .put(userEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: userId,
                firstName: "Bob",
                lastName: "Bobby"
            });

        expect(response.status).toEqual(403);

        await postgreSQLDatabase.connect();
        await postgreSQLDatabase.query("UPDATE application_users SET role = 'USER_ROLE' WHERE id = $1", [userId]);
        await postgreSQLDatabase.close();
    });

    test("Cannot update if user is not logged in", async () => {
        const response = await request(app)
            .put(userEndpoint)
            .send({
                updatedUserId: userId,
                firstName: "Bob",
                lastName: "Bobby"
            });

        expect(response.status).toEqual(403);
    });

    test("Cannot update if updated user ID doesn't match authenticated user ID", async () => {
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
                updatedUserId: "asdf123",
                firstName: "Bob",
                lastName: "Bobby"
            });

        expect(response.status).toEqual(403);
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
    });
});