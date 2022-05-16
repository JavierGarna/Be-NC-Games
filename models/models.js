const db = require("../db/connection");

exports.fetchCategories = () => {
    const queryStr = "SELECT * FROM categories";

    return db.query(queryStr).then((response) => {
        return response.rows;
    })
};

exports.fetchReview = (review_id) => {
    const queryStr = `SELECT * FROM reviews WHERE review_id = ${review_id}`;
    return db.query(queryStr).then((response) => {
        if(!response.rows.length) {
            return Promise.reject({ status: 404, msg: "not found"})
        }
        return response.rows[0];
    })
};