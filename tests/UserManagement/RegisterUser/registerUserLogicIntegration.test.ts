import {afterAll, describe, expect, test} from '@jest/globals';
import PostgreSQLDatabase from "../../../services/database/PostgreSQLDatabase";
import "dotenv/config";
import {app} from "../../../app";
import request from "supertest";

const userEndpoint = "/user";


afterAll(async() => {
    const postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    await postgreSQLDatabase.connect();
    await postgreSQLDatabase.query("TRUNCATE TABLE application_users");
    await postgreSQLDatabase.close();
});

describe("POST to register route to check for feature's logic", () => {
    test("should return a 201 HTTP response", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                username: "UserTest",
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1",
                firstName: "Lorem",
                lastName: "Ipsum"
            });

        expect(response.status).toEqual(201);
    });

    test("without a first name or a last name should return a 201 HTTP response", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                username: "UserTest2",
                email: "test2@gmail.com",
                password: "my Test pasSDF234 sword1",
                firstName: "Lorem",
                lastName: "Ipsum"
            });
        
        expect(response.status).toEqual(201);
    });

    test("already used email address should return a 403 HTTP response", async () => {
        const response = await request(app)
            .post(userEndpoint)
            .send({
                username: "UserTest",
                email: "test@gmail.com",
                password: "my Test pas SDF23sword1",
                firstName: "Lorem",
                lastName: "Ipsum"
            });

        expect(response.status).toEqual(403);
    });
});