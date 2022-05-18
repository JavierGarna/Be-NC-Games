const { fetchCategories, fetchReview, fetchPatchReview, fetchUsers } = require("../models/models")

exports.getCategories = (req, res, next) => {
    fetchCategories().then((categories) => {
        res.status(200).send({ categories });
    })
};

exports.getReview = (req, res, next) => {
    const { review_id } = req.params;
    fetchReview(review_id).then((review) => {
        res.status(200).send({ review });
    }).catch((err) => {
        next(err);
    })
};

exports.patchReview = (req, res, next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body;
    fetchPatchReview(review_id, inc_votes).then((review) => {
        res.status(200).send({ review })
    }).catch((err) => {
        next(err);
    })
};

exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
        res.status(200).send({ users })
    })
};