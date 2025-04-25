import {afterAll, describe, expect, test} from '@jest/globals';
import axios from 'axios';
import PostgreSQLDatabase from "../services/database/PostgreSQLDatabase";
import "dotenv/config";

const server = require("app.ts").server;
const registerEndpoint = "http://localhost:8080/register";

afterAll(async() => {
    const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    await postgreSQLDatabase.connect();
    await postgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await postgreSQLDatabase.close();
    await server.close();
});

describe("POST to register route", () => {
    test("should return a 201 HTTP response", async () => {
        const response = await axios.post(registerEndpoint, {
            username: "UserTest",
            email: "test@gmail.com",
            password: "my Test pas SDF23sword1",
            firstName: "Lorem",
            lastName: "Ipsum"
        })
        expect(response.status).toEqual(201);
    });

    test("empty username field returns a 422 HTTP response", async () => {
        axios.post(registerEndpoint, {
            username: "",
            email: "test@gmail.com",
            password: "my Test password1",
            firstName: "Lorem",
            lastName: "Ipsum"
        })
        .catch((error) => {
            if (error.response) {
                expect(error.response.status).toEqual(422);
            }
        })
    });

    test("empty password field returns a 422 HTTP response", async () => {
        axios.post(registerEndpoint, {
            username: "UserTest",
            email: "test@gmail.com",
            password: "",
            firstName: "Lorem",
            lastName: "Ipsum"
        })
        .catch((error) => {
            if (error.response) {
                expect(error.response.status).toEqual(422);
            }
        })
    });

    test("empty email field returns a 422 HTTP response", async () => {
        axios.post(registerEndpoint, {
            username: "UserTest",
            email: "",
            password: "my Test password1",
            firstName: "Lorem",
            lastName: "Ipsum"
        })
        .catch((error) => {
            if (error.response) {
                expect(error.response.status).toEqual(422);
            }
        })
    });

    test("without a first name or a last name should return a 201 HTTP response", async () => {
        const response = await axios.post(registerEndpoint, {
            username: "UserTest",
            email: "test2@gmail.com",
            password: "my Test pasSDF234 sword1",
            firstName: "Lorem",
            lastName: "Ipsum"
        })
        expect(response.status).toEqual(201);
    });

    test("username without letters should return a 403 HTTP response", async () => {
        axios.post(registerEndpoint, {
            username: "1234",
            email: "test3@gmail.com",
            password: "my Test password1",
            firstName: "Lorem",
            lastName: "Ipsum"
        })
        .catch((error) => {
            if (error.response) {
                expect(error.response.status).toEqual(403);
            }
        })
    });

    test("username with special characters should return a 403 HTTP response", async () => {
        axios.post(registerEndpoint, {
            username: "asdb!#asdf",
            email: "test3@gmail.com",
            password: "my Test password1",
            firstName: "Lorem",
            lastName: "Ipsum"
        })
        .catch((error) => {
            if (error.response) {
                expect(error.response.status).toEqual(403);
            }
        })
    });

    test("not valid emails should return a 403 HTTP response", async () => {
        axios.post(registerEndpoint, {
            username: "UserTest",
            email: "test@mail.c",
            password: "my Test password1",
            firstName: "Lorem",
            lastName: "Ipsum"
        })
        .catch((error) => {
            if (error.response) {
                expect(error.response.status).toEqual(403);
            }
        })
    });

    test("under 12 characters password should return a 403 HTTP response", async () => {
        axios.post(registerEndpoint, {
            username: "UserTest",
            email: "test3@gmail.com",
            password: "Sdf",
            firstName: "Lorem",
            lastName: "Ipsum"
        })
        .catch((error) => {
            if (error.response) {
                expect(error.response.status).toEqual(403);
            }
        })
    });

    test("password with less than 3 lowercase letters should return a 403 HTTP response", async () => {
        axios.post(registerEndpoint, {
            username: "SDSDFSDFSDFSDF",
            email: "test3@gmail.com",
            password: "Sdf",
            firstName: "Lorem",
            lastName: "Ipsum"
        })
        .catch((error) => {
            if (error.response) {
                expect(error.response.status).toEqual(403);
            }
        })
    });

    test("password with less than 3 uppercase letters should return a 403 HTTP response", async () => {
        axios.post(registerEndpoint, {
            username: "SDSDFSDFSDFSDF",
            email: "test3@gmail.com",
            password: "asdfsadfsdfsdfasf",
            firstName: "Lorem",
            lastName: "Ipsum"
        })
        .catch((error) => {
            if (error.response) {
                expect(error.response.status).toEqual(403);
            }
        })
    });

    test("password with less than 3 symbols, special characters or space should return a 403 HTTP response", async () => {
        axios.post(registerEndpoint, {
            username: "SDSDFSDFSDFSDF",
            email: "test3@gmail.com",
            password: "SDfsdfsdfsFSDfsdfsfSdfSdf",
            firstName: "Lorem",
            lastName: "Ipsum"
        })
        .catch((error) => {
            if (error.response) {
                expect(error.response.status).toEqual(403);
            }
        })
    });

    test("password with less than 3 numbers should return a 403 HTTP response", async () => {
        axios.post(registerEndpoint, {
            username: "SDSDFSDFSDFSDF",
            email: "test3@gmail.com",
            password: "SDfsdf sdfsFSDfs dfsfSd fSdf",
            firstName: "Lorem",
            lastName: "Ipsum"
        })
        .catch((error) => {
            if (error.response) {
                expect(error.response.status).toEqual(403);
            }
        })
    });
});