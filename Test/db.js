var mysql = require('mysql');

//connect to mysql database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gillibean123",
  database: "userlog"
});


//sql query function
function executeQuery(sql, cb) {
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        cb(result);
    });
}


module.exports = con;
