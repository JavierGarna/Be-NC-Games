const express = require("express");
const app = express();
const { getCategories, getReview } = require("./controllers/controllers")

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReview);

app.use((err, req, res, next) => {
    if (err.code === '42703') {
        res.status(400).send({ msg: "bad request"})
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    res.status(err.status).send({ msg: err.msg})
});

app.use((req, res, next) => {
    res.status(404).send({ msg: "not found"})
});

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "internal server error"});
});

module.exports = app;