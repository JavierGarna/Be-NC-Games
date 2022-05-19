const { fetchReview, fetchPatchReview, fetchReviews, fetchReviewComments, insertComment } = require("../models/reviews.models");

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

exports.getReviews = (req, res, next) => {
    const { sort_by, order, category } = req.query;
    fetchReviews(sort_by, order, category).then((reviews) => {
        res.status(200).send({ reviews });
    }).catch((err) => {
        console.log(err)
        next(err);
    })
};

exports.getReviewComments = (req, res, next) => {
    const { review_id } = req.params;
    fetchReviewComments(review_id).then((comments) => {
        res.status(200).send({ comments });
    }).catch((err) => {
        next(err);
    });
};

exports.postComment = (req, res, next) => {
    const { body, username:author } = req.body;
    const { review_id } = req.params;
    insertComment(review_id, body, author).then((comment) => {
        if(comment === undefined) {
            return Promise.reject({ status: 400, msg: "bad request"})
        }
        res.status(201).send({ comment })
    }).catch((err) => {
        next(err);
    });
};