const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
require("jest-sorted")

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
});

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
                created_at: "2021-01-18T10:00:20.514Z",
                comment_count: 0
            })
        })
    });
    test('200: responds with the correct review object with the correct comment_count', () => {
        return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body }) => {
            const { review } = body;
            expect(review).toMatchObject({
                review_id: 2,
                comment_count: 3
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
});

describe("PATCH /api/reviews/:review_id", () => {
    test('200: responds with an updated review depending on inc_votes', () => {
        return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: 3})
        .expect(200)
        .then((response) => {
            expect(response.body.review).toMatchObject({
                review_id: 1,
                title: 'Agricola',
                review_body: 'Farmyard fun!',
                designer: 'Uwe Rosenberg',
                review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                votes: 4,
                category: 'euro game',
                owner: 'mallionaire',
                created_at: "2021-01-18T10:00:20.514Z"
            });
        });
    });
    test('404: responds with a not found message when passed an id not stored', () => {
        return request(app)
        .patch("/api/reviews/99999")
        .send({ inc_votes: 1})
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("not found");
        });
    });
    test('400: responds with a bad request message when passed not a number in the id', () => {
        return request(app)
        .patch("/api/reviews/amigo")
        .send({ inc_votes: 1})
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("bad request");
        })
    });
    test('400: responds with a bad request message when passed not a number in inc_votes', () => {
        return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: "uno"})
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("bad request");
        })
    });
});

describe("GET /api/users", () => {
    test('200: responds with an array of objects with the properties username, name and avatar_url', () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
            expect(response.body.users).toHaveLength(4);
            response.body.users.forEach((user) => {
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                )
            })
        })
    });
});

describe("GET /api/reviews", () => {
    test('200: responds with a reviews array containing the correct properties', () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
            expect(response.body.reviews).toHaveLength(13);
            response.body.reviews.forEach((review) => {
                expect(review).toEqual(
                    expect.objectContaining({
                        owner: expect.any(String),
                        title: expect.any(String),
                        review_id: expect.any(Number),
                        category: expect.any(String),
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                    })
                )
            })
            expect(response.body.reviews).toBeSorted({ key: "created_at", descending: true})
        });
    });
    test('200: responds with a reviews array containing comment_count', () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
            expect(response.body.reviews).toHaveLength(13);
            response.body.reviews.forEach((review) => {
                expect(review).toEqual(
                    expect.objectContaining({
                        comment_count: expect.any(Number)
                    })
                );
            });
        });
    });
});