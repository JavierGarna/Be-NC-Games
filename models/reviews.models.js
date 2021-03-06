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
    const queryStr = `UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *`;
    return db.query(queryStr, [review_id, inc_votes]).then((response) => {
        if(!response.rows.length) {
            return Promise.reject({ status: 404, msg: "not found"})
        }
        return response.rows[0];
    });
};

exports.fetchReviews = (sort_by, order = 'DESC', category) => {
    const validSortBy = ['title', 'designer', 'owner', 'review_body', 'category', 'created_at', 'votes'];
    const validOrder = ['ASC', 'DESC'];
    order = order.toUpperCase();
    const array = [];
    let queryStr = `
    SELECT reviews.*, COUNT(comments.comment_id)::int AS comment_count 
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id`
    let queryStr2 = `SELECT * FROM categories`

    if (!validOrder.includes(order)) {
        return Promise.reject( { status: 400, msg: "bad request"});
    };

    if (category) {
        queryStr += ` WHERE reviews.category = $1`
        queryStr2 += ` WHERE categories.slug = $1;`
        array.push(category)
    }

    queryStr += ` GROUP BY reviews.review_id`

    if (sort_by) {
        if (validSortBy.includes(sort_by)) {
            queryStr += ` ORDER BY ${sort_by} ${order};`
        } else {
            return Promise.reject({ status: 400, msg: "bad request" });
        }
    } else {
        queryStr += ` ORDER BY created_at ${order};`
    }

    const getReviews = db.query(queryStr, array);
    const checkCategoryExists = db.query(queryStr2, array)
    if(category) {
        return Promise.all([getReviews, checkCategoryExists]).then((promiseArray) => {
            if (!promiseArray[1].rows.length) {
                return Promise.reject({ status: 404, msg: "not found" });
            } return promiseArray[0].rows;
        })
    } else {
        return getReviews.then((response) => {
            return response.rows;
        })
    };
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
    });
};