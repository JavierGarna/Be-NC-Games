const { fetchReview, fetchPatchReview, fetchReviews, fetchReviewComments } = require("../models/reviews.models");

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
    fetchReviews().then((reviews) => {
        res.status(200).send({ reviews });
    });
};

exports.getReviewComments = (req, res, next) => {
    const { review_id } = req.params;
    fetchReviewComments(review_id).then((comments) => {
        res.status(200).send({ comments });
    }).catch((err) => {
        next(err);
    });
};