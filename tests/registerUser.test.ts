import {beforeAll, afterAll, describe, expect, test} from '@jest/globals';
const request = require("supertest");

let app: any;
let server: any;

beforeAll(() => {
    app = request(require("app").App);
    server = require("app").Server;
});

afterAll(async () => {
    app = null;
    server.close();
});

describe("POST to register route", () => {
    test("should return a 201 HTTP response", async() => {
        const response = await app.post("/register")
            .send({
                username: "UserTest",
                email: "test@gmail.com",
                password: "my Test password1",
                firstName: "Lorem",
                lastName: "Ipsum"
            })
            .set('Accept', 'application/json');
        expect(response.status).toEqual(201);
    })
});