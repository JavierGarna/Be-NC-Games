const express = require("express");
const app = express();
const { getCategories } = require("./controllers/controllers")

app.use(express.json());

app.get("/api/categories", getCategories);

app.use((req, res, next) => {
    res.status(404).send({ msg: "not found"})
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "internal server error"});
});

module.exports = app;