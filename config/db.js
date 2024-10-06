const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',     // Replace with your database username
    password: '', // Replace with your database password
    database: 'spotify'  // Replace with your database name
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

module.exports = db;
