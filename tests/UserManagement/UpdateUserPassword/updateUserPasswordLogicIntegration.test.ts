import {afterAll, describe, expect, test} from "@jest/globals";
import PostgreSQLDatabase from "../../../services/database/PostgreSQLDatabase";
import "dotenv/config";
import {app} from "../../../app";
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

describe("PUT to user password route", () => {
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
            .put(userPasswordEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: userId,
                originalPassword: "my Test pas SDF23sword1",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: "my Test pas SDF23sword2"
            });

        expect(response.status).toEqual(200);
    });

    test("User can log in with its changed password", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword2"
            });
        
        expect(authenticationResponse.status).toEqual(200);
    });

    test("User cannot log in with its original password", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1"
            });
        
        expect(authenticationResponse.status).toEqual(401);
    });

    test("User cannot update its own password if original password doesn't match", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword2"
            });

        const response = await request(app)
            .put(userPasswordEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: userId,
                originalPassword: "my Test pas SDF23sword1",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: "my Test pas SDF23sword2"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Original password is not recognised");
        expect(response.body.code).toEqual("original_password_not_recognised");
    });

    test("User cannot update its own password if changed password and changed password confirmation do not match", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword2"
            });

        const response = await request(app)
            .put(userPasswordEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: userId,
                originalPassword: "my Test pas SDF23sword2",
                changedPassword: "my Test pas SDF23sword3",
                changedPasswordConfirmation: "my Test pas SDF23sword4"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Changed password and confirmation do not match");
        expect(response.body.code).toEqual("changed_password_and_confirmation_do_not_match");
    });

    test("User original password and changed password must be different", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword2"
            });

        const response = await request(app)
            .put(userPasswordEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: userId,
                originalPassword: "my Test pas SDF23sword2",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: "my Test pas SDF23sword2"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Original password and changed password are identical");
        expect(response.body.code).toEqual("original_password_and_changed_password_identical");
    });

    test("User cannot update its own password if is not logged in", async () => {
        const response = await request(app)
            .put(userPasswordEndpoint)
            .send({
                updatedUserId: userId,
                originalPassword: "my Test pas SDF23sword2",
                changedPassword: "my Test pas SDF23sword3",
                changedPasswordConfirmation: "my Test pas SDF23sword3"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("User is not authenticated");
        expect(response.body.code).toEqual("user_not_authenticated");
    });

    test("User cannot update its own password if updated user ID doesn't match authenticated user ID", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword2"
            });

        const response = await request(app)
            .put(userPasswordEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: "dfsadf123",
                originalPassword: "my Test pas SDF23sword2",
                changedPassword: "my Test pas SDF23sword3",
                changedPasswordConfirmation: "my Test pas SDF23sword3"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Cannot update another user's password");
        expect(response.body.code).toEqual("cannot_update_another_user_s_password");
    });

    test("User cannot update its own password if user role is not recognised", async () => {
        const authenticationResponse = await request(app)
            .post(autenticationEndpoint)
            .send({
                email: "test@gmail.com",
                password: "my Test pas SDF23sword2"
            });

        const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
        await postgreSQLDatabase.connect();
        await postgreSQLDatabase.query("UPDATE application_users SET role = 'sdfasdfasd' WHERE id = $1", [userId]);
        await postgreSQLDatabase.close();

        const response = await request(app)
            .put(userPasswordEndpoint)
            .set("Authorization", "Bearer " + authenticationResponse.body.token)
            .send({
                updatedUserId: userId,
                originalPassword: "my Test pas SDF23sword2",
                changedPassword: "my Test pas SDF23sword3",
                changedPasswordConfirmation: "my Test pas SDF23sword3"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("User role was not recognised");
        expect(response.body.code).toEqual("user_role_not_recognised");

        await postgreSQLDatabase.connect();
        await postgreSQLDatabase.query("UPDATE application_users SET role = 'USER_ROLE' WHERE id = $1", [userId]);
        await postgreSQLDatabase.close();
    });
});