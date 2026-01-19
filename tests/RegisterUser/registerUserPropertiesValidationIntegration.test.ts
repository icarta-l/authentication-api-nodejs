import {afterAll, describe, expect, test} from '@jest/globals';
import PostgreSQLDatabase from "../../services/database/PostgreSQLDatabase";
import "dotenv/config";
import {app} from "../../app";
import request from "supertest";

const userEndpoint = "/user";


afterAll(async() => {
    const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    await postgreSQLDatabase.connect();
    await postgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await postgreSQLDatabase.close();
});

describe("POST to register route to check for properties validation", () => {
    test("empty username field returns a 422 HTTP response", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                username: "",
                email: "test@gmail.com",
                password: "my Test password1",
                firstName: "Lorem",
                lastName: "Ipsum"
            });

        expect(response.status).toEqual(422);
    });

    test("empty password field returns a 422 HTTP response", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                username: "UserTest",
                email: "test@gmail.com",
                password: "",
                firstName: "Lorem",
                lastName: "Ipsum"
            });

        expect(response.status).toEqual(422);
    });

    test("empty email field returns a 422 HTTP response", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                username: "UserTest",
                email: "",
                password: "my Test password1",
                firstName: "Lorem",
                lastName: "Ipsum"
            });

        expect(response.status).toEqual(422);
    });

    test("username without letters should return a 403 HTTP response", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                username: "1234",
                email: "test3@gmail.com",
                password: "my Test password1",
                firstName: "Lorem",
                lastName: "Ipsum"
            });

        expect(response.status).toEqual(403);
    });

    test("username with special characters should return a 403 HTTP response", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                username: "asdfas*+!s",
                email: "test3@gmail.com",
                password: "my Test password1",
                firstName: "Lorem",
                lastName: "Ipsum"
            });

        expect(response.status).toEqual(403);
    });

    test("not valid emails should return a 403 HTTP response", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                username: "UserTest",
                email: "test@mail.c",
                password: "my Test password1",
                firstName: "Lorem",
                lastName: "Ipsum"
            });

        expect(response.status).toEqual(403);
    });

    test("under 12 characters password should return a 403 HTTP response", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                username: "UserTest",
                email: "test3@gmail.com",
                password: "Sdf",
                firstName: "Lorem",
                lastName: "Ipsum"
            });

        expect(response.status).toEqual(403);
    });

    test("password with less than 3 lowercase letters should return a 403 HTTP response", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                username: "SDSDFSDFSDFSDF",
                email: "test3@gmail.com",
                password: "Sdf",
                firstName: "Lorem",
                lastName: "Ipsum"
            });

        expect(response.status).toEqual(403);
    });

    test("password with less than 3 uppercase letters should return a 403 HTTP response", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                username: "SDSDFSDFSDFSDF",
                email: "test3@gmail.com",
                password: "asdfsadfsdfsdfasf",
                firstName: "Lorem",
                lastName: "Ipsum"
            });

        expect(response.status).toEqual(403);
    });

    test("password with less than 3 symbols, special characters or space should return a 403 HTTP response", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                username: "SDSDFSDFSDFSDF",
                email: "test3@gmail.com",
                password: "SDfsdfsdfsFSDfsdfsfSdfSdf",
                firstName: "Lorem",
                lastName: "Ipsum"
            });

        expect(response.status).toEqual(403);
    });

    test("password with less than 3 numbers should return a 403 HTTP response", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                username: "SDSDFSDFSDFSDF",
                email: "test3@gmail.com",
                password: "SDfsdf sdfsFSDfs dfsfSd fSdf",
                firstName: "Lorem",
                lastName: "Ipsum"
            });

        expect(response.status).toEqual(403);
    });
});