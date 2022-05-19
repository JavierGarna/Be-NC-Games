const db = require("../db/connection");

exports.fetchReview = (review_id) => {
    const queryStr = `
    SELECT reviews.*, COUNT(comments.comment_id)::int AS comment_count 
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;`

    return db.query(queryStr, [review_id]).then((response) => {
        if(!response.rows.length) {
            return Promise.reject({ status: 404, msg: "not found"})
        }
        return response.rows[0];
    })
};

exports.fetchPatchReview = (review_id, inc_votes) => {
    const queryStr = `SELECT * FROM reviews WHERE review_id = ${review_id}`;
    return db.query(queryStr).then((response) => {
        if(!response.rows.length) {
            return Promise.reject({ status: 404, msg: "not found"})
        }
        if(inc_votes) {
            if(typeof inc_votes !== "number") {
                return Promise.reject({ status: 400, msg: "bad request"})
            }
            response.rows[0].votes += inc_votes;
        }
        return response.rows[0];
    });
};

exports.fetchReviews = () => {
    const queryStr = `
    SELECT reviews.*, COUNT(comments.comment_id)::int AS comment_count 
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY created_at DESC;`

    return db.query(queryStr).then((response) => {
        return response.rows;
    });
};

exports.fetchReviewComments = (review_id) => {
    const queryStr = `SELECT * FROM comments WHERE review_id = $1`
    const queryStr2 = `SELECT * FROM reviews WHERE review_id = $1`
    const getComments = db.query(queryStr, [review_id])
    const checkArticleExists = db.query(queryStr2, [review_id])

    return Promise.all([getComments,checkArticleExists]).then((promiseArray) => {
        if(!promiseArray[1].rows.length) {
            return Promise.reject({ status: 404, msg: "not found"})
        }
        return promiseArray[0].rows
    })
};

exports.insertComment = (review_id, body, author) => {
    const queryStr2 = `INSERT INTO comments (review_id, body, author) VALUES ($1, $2, $3) RETURNING *`

    return db.query(queryStr2, [review_id, body, author]).then((response) => {
        return response.rows[0];
    }).catch((err) => {
        if (err.code === '23503') {
            return Promise.reject({ status: 404, msg: "not found"})
        }
    });
};