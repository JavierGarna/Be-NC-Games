const db = require("../db/connection");

exports.removeComment = (comment_id) => {
    const queryStr = `DELETE FROM comments WHERE comment_id = $1 RETURNING *`

    return db.query(queryStr, [comment_id]).then((response) => {
        if (!response.rows.length) {
            return Promise.reject({ status: 404, msg: "not found"});
        }
        return response.rows;
    })
}