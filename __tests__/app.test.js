const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    if (db.end) db.end();
});

describe("GET /api/categories", () => {
    test('200: responds with an array of category objects with the properties slug and description', () => {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
            expect(response.body.categories).toHaveLength(4);
            response.body.categories.forEach((category) => {
                expect(category).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                )
            })
        })
    });
    test('404: responds with a not found message when the path does not exist', () => {
        return request(app)
        .get("/api/cateogries")
        .expect(404)
        .then((response) => {
            console.log(response.body)
            expect(response.body.msg).toBe("not found");
        })
    });
})