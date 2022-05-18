const db = require("../db/connection");

exports.fetchCategories = () => {
    const queryStr = "SELECT * FROM categories";

    return db.query(queryStr).then((response) => {
        return response.rows;
    })
};

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
        console.log(response.rows)
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

exports.fetchUsers = () => {
    const queryStr = "SELECT * FROM users";

    return db.query(queryStr).then((response) => {
        return response.rows;
    });
};