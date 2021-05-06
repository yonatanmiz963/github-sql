var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'freedb.tech',
    port: 3306,
    user: 'freedbtech_yonatanmiz',
    password: 'mfmfa424k',
    database: 'freedbtech_githubDB',
    insecureAuth: true
});

connection.connect(err => {
    if (err) throw new Error('mySql failed connection');
    console.log('connected to SQL server');
})


function runSQL(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, function (error, results, fields) {
            if (error) reject(error);
            else resolve(results);
            // // not entirely clear on whether connection.end() should be called here or not.
            // // Leaning towards not.
            // connection.end();
        });
    })
}

module.exports = {
    runSQL
}