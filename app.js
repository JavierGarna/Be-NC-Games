const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controllers")
const { getReview, patchReview, getReviews, getReviewComments, postComment } = require("./controllers/reviews.controllers")
const { getUsers } = require("./controllers/users.controllers")

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReview);

app.patch("/api/reviews/:review_id", patchReview);

app.get("/api/users", getUsers);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getReviewComments);

app.post("/api/reviews/:review_id/comments", postComment);

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "not found"})
});

app.use((err, req, res, next) => {
    if (err.code === '42703' || err.code === '22P02') {
        res.status(400).send({ msg: "bad request"})
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err);
    };
});

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg: "internal server error"});
});

module.exports = app;