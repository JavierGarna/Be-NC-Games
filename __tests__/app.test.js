const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    db.end();
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
            expect(response.body.msg).toBe("not found");
        })
    });
})

describe("GET /api/reviews/:review_id", () => {
    test('200: responds with a review object with the passed id', () => {
        return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then(({ body }) => {
            const { review } = body;
            expect(review).toEqual({
                review_id: 1,
                title: 'Agricola',
                review_body: 'Farmyard fun!',
                designer: 'Uwe Rosenberg',
                review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                votes: 1,
                category: 'euro game',
                owner: 'mallionaire',
                created_at: "2021-01-18T10:00:20.514Z"
            })
        })
    });
    test('404: responds with a not found message when passed an id not stored', () => {
        return request(app)
        .get("/api/reviews/99999")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("not found");
        })
    });
    test('400: responds with a bad request message when passed a wrong id', () => {
        return request(app)
        .get("/api/reviews/amigo")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("bad request");
        })
    });
})