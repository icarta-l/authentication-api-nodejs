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
    test("should return a 200 HTTP response", async () => {
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
        expect(response.body.message).toEqual("User role was not recognised");
        expect(response.body.code).toEqual("user_role_not_recognised");

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
        expect(response.body.message).toEqual("User is not authenticated");
        expect(response.body.code).toEqual("user_not_authenticated");
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
        expect(response.body.message).toEqual("Cannot update another user");
        expect(response.body.code).toEqual("cannot_update_another_user");
    });
});