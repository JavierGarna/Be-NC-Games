const db = require("../db/connection");

exports.fetchCategories = () => {
    const queryStr = "SELECT * FROM categories";

    return db.query(queryStr).then((response) => {
        return response.rows;
    })
};

exports.fetchReview = (review_id, comment_count = 0) => {
    const queryStr = `SELECT * FROM reviews WHERE review_id = ${review_id}`;
    const queryComments = `SELECT * FROM comments`
    db.query(queryComments).then((response) => {
        for (let i = 0; i < response.rows.length; i++) {
            if (response.rows[i].review_id == review_id) {
                comment_count++;
            };
        };
    });
    return db.query(queryStr).then((response) => {
        if(!response.rows.length) {
            return Promise.reject({ status: 404, msg: "not found"})
        }
        response.rows[0].comment_count = comment_count;
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