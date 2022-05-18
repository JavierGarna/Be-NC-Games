const db = require("../db/connection");

exports.fetchUsers = () => {
    const queryStr = "SELECT * FROM users";

    return db.query(queryStr).then((response) => {
        return response.rows;
    });
};