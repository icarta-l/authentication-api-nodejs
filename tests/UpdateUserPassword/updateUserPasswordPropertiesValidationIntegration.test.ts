import {afterAll, beforeAll, describe, expect, test} from "@jest/globals";
import PostgreSQLDatabase from "../../services/database/PostgreSQLDatabase";
import "dotenv/config";
import {app} from "../../app";
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

    expect(registerResponse.status).toEqual(201);

    const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    await postgreSQLDatabase.connect();
    const rawRetrievedQuery = await postgreSQLDatabase.query("SELECT id FROM application_users WHERE email = $1", ["test@gmail.com"]);
    userId = rawRetrievedQuery.rows[0].id;
    await postgreSQLDatabase.close();
});

describe("Wrong properties values", () => {
    test("Cannot update a user without a requested user id", async () => {
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
                updatedUserId: "",
                originalPassword: "my Test pas SDF23sword1",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: "my Test pas SDF23sword2"
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Cannot update a user's password without an updated user id");
        expect(response.body.code).toEqual("updated_user_id_not_informed");
    });

    test("Cannot update a user without an original password informed", async () => {
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
                originalPassword: "",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: "my Test pas SDF23sword2"
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Cannot update a user's password without an original password informed");
        expect(response.body.code).toEqual("original_password_not_informed");
    });

    test("Cannot update a user without a changed password informed", async () => {
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
                changedPassword: "",
                changedPasswordConfirmation: "my Test pas SDF23sword2"
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Cannot update a user's password without a changed password informed");
        expect(response.body.code).toEqual("changed_password_not_informed");
    });

    test("Cannot update a user without a changed password confirmation informed", async () => {
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
                changedPasswordConfirmation: ""
            });

        expect(response.status).toEqual(422);
        expect(response.body.message).toEqual("Cannot update a user's password without a changed password confirmation informed");
        expect(response.body.code).toEqual("changed_password_confirmation_not_informed");
    });

    test("Cannot update a user's password with an updated user ID that is not alphanumerical", async () => {
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
                updatedUserId: "lsdfé*[]!,",
                originalPassword: "my Test pas SDF23sword1",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: "my Test pas SDF23sword2"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Updated user ID is not alphanumerical");
        expect(response.body.code).toEqual("updated_user_id_not_alphanumerical");
    });

    test("Original password should be at least 12 characters long", async () => {
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
                originalPassword: "Sdf",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: "my Test pas SDF23sword2"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Original password must be at least 12 characters long");
        expect(response.body.code).toEqual("original_password_doesnt_have_12_characters");
    });

    test("Original password should have at least 3 lowercase letters", async () => {
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
                originalPassword: "Sdf SDFSDFSDFSDFSDFSDFSDF",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: "my Test pas SDF23sword2"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Original password needs to have at least 3 lowercase letters");
        expect(response.body.code).toEqual("original_password_doesnt_have_3_lowercase_letters");
    });

    test("Original password should have at least 3 uppercase letters", async () => {
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
                originalPassword: "Sdf asdfasdfasdfsdf",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: "my Test pas SDF23sword2"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Original password needs to have at least 3 uppercase letters");
        expect(response.body.code).toEqual("original_password_doesnt_have_3_uppercase_letters");
    });

    test("Original password should have at least 3 symbols, special characters or space", async () => {
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
                originalPassword: "Sdf aSDFSDFSDFSDFSDFsdfsdf",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: "my Test pas SDF23sword2"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Original password needs to have at least 3 symbols, special characters or space");
        expect(response.body.code).toEqual("original_password_miss_special_characters");
    });

    test("Original password should have at least 3 numbers", async () => {
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
                originalPassword: "Sdf aSDFSD FSDFS DFSDFs dfsdf",
                changedPassword: "my Test pas SDF23sword2",
                changedPasswordConfirmation: "my Test pas SDF23sword2"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Original password needs to have at least 3 numbers");
        expect(response.body.code).toEqual("original_password_doesnt_have_3_numbers");
    });

    test("Changed password should be at least 12 characters long", async () => {
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
                changedPassword: "Sdf",
                changedPasswordConfirmation: "my Test pas SDF23sword2"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Changed password must be at least 12 characters long");
        expect(response.body.code).toEqual("changed_password_doesnt_have_12_characters");
    });

    test("Changed password should have at least 3 lowercase letters", async () => {
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
                changedPassword: "Sdf SDFSDFSDFSDFSDFSDFSDF",
                changedPasswordConfirmation: "my Test pas SDF23sword2"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Changed password needs to have at least 3 lowercase letters");
        expect(response.body.code).toEqual("changed_password_doesnt_have_3_lowercase_letters");
    });

    test("Changed password should have at least 3 uppercase letters", async () => {
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
                changedPassword: "Sdf asdfasdfasdfsdf",
                changedPasswordConfirmation: "my Test pas SDF23sword2"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Changed password needs to have at least 3 uppercase letters");
        expect(response.body.code).toEqual("changed_password_doesnt_have_3_uppercase_letters");
    });

    test("Changed password should have at least 3 symbols, special characters or space", async () => {
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
                changedPassword: "Sdf aSDFSDFSDFSDFSDFsdfsdf",
                changedPasswordConfirmation: "my Test pas SDF23sword2"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Changed password needs to have at least 3 symbols, special characters or space");
        expect(response.body.code).toEqual("changed_password_miss_special_characters");
    });

    test("Changed password should have at least 3 numbers", async () => {
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
                changedPassword: "Sdf aSDFSD FSDFS DFSDFs dfsdf",
                changedPasswordConfirmation: "my Test pas SDF23sword2"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Changed password needs to have at least 3 numbers");
        expect(response.body.code).toEqual("changed_password_doesnt_have_3_numbers");
    });

    test("Changed password confirmation should be at least 12 characters long", async () => {
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
                changedPasswordConfirmation: "Sdf"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Changed password confirmation must be at least 12 characters long");
        expect(response.body.code).toEqual("changed_password_confirmation_doesnt_have_12_characters");
    });

    test("Changed password confirmation should have at least 3 lowercase letters", async () => {
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
                changedPasswordConfirmation: "Sdf SDFSDFSDFSDFSDFSDFSDF"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Changed password confirmation needs to have at least 3 lowercase letters");
        expect(response.body.code).toEqual("changed_password_confirmation_doesnt_have_3_lowercase_letters");
    });

    test("Changed password confirmation should have at least 3 uppercase letters", async () => {
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
                changedPasswordConfirmation: "Sdf asdfasdfasdfsdf"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Changed password confirmation needs to have at least 3 uppercase letters");
        expect(response.body.code).toEqual("changed_password_confirmation_doesnt_have_3_uppercase_letters");
    });

    test("Changed password confirmation should have at least 3 symbols, special characters or space", async () => {
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
                changedPasswordConfirmation: "Sdf aSDFSDFSDFSDFSDFsdfsdf"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Changed password confirmation needs to have at least 3 symbols, special characters or space");
        expect(response.body.code).toEqual("changed_password_confirmation_miss_special_characters");
    });

    test("Changed password confirmation should have at least 3 numbers", async () => {
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
                changedPasswordConfirmation: "Sdf aSDFSD FSDFS DFSDFs dfsdf"
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual("Changed password confirmation needs to have at least 3 numbers");
        expect(response.body.code).toEqual("changed_password_confirmation_doesnt_have_3_numbers");
    });
});