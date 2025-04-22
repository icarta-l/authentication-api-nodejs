import {beforeAll, afterAll, describe, expect, it, test} from '@jest/globals';
import axios from 'axios';

describe("POST to register route", () => {
    test("should return a 201 HTTP response", async () => {
        const response = await axios.post("http://localhost:8080/register", {
            username: "UserTest",
            email: "test@gmail.com",
            password: "my Test password1",
            firstName: "Lorem",
            lastName: "Ipsum"
        })
        expect(response.status).toEqual(201);
    })
});