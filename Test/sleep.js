require('./app.js');
var db = require('./db');

//sql query function
function executeQuery(sql, cb) {
    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        cb(result);
    });
}

module.exports = function (session) {
  function getSleeptip(callback)
  {

  executeQuery("SELECT content FROM copingstrategies WHERE category = 'sleep' AND type ='tip' ORDER BY RAND() LIMIT 1", function (err, result) {
    if (err)
               callback(err,null);
           else
               callback(null,result[0].hexcode);
                       });


  }

getSleeptip(function(data){
            // code to execute on data retrieval

sleeptip = data[0].content;


console.log(sleeptip);

session.send(sleeptip);

});

       session.send({
       attachments: [
                    {
                       contentType: 'image/gif',
                       contentUrl: 'https://media.giphy.com/media/ZLxRWG0vhzpiE/giphy.gif',
                       name: 'Sleeping'
                    }
                  ]
                });
};
