const express = require("express");
const app = express();
const { getCategories, getReview, patchReview, getUsers, getReviews } = require("./controllers/controllers")

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReview);

app.patch("/api/reviews/:review_id", patchReview);

app.get("/api/users", getUsers);

app.get("/api/reviews", getReviews);

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
    res.status(err.status).send({ msg: err.msg})
});

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "internal server error"});
});

module.exports = app;