const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",     // change to your MySQL user
  password: "root123", // change to your MySQL password
  database: "tasksdb"
});

module.exports = pool;
