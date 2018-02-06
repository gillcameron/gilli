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
  function getStresstip(callback)
  {

  executeQuery("SELECT content FROM copingstrategies WHERE category = 'stress' AND type ='tip' ORDER BY RAND() LIMIT 1", function (err, result) {
    if (err)
               callback(err,null);
           else
               callback(null,result[0].hexcode);
                       });


  }

getStresstip(function(data){
            // code to execute on data retrieval

stresstip = data[0].content;


console.log(stresstip);

session.send(stresstip);

});

 session.send({
attachments: [
            {
               contentType: 'image/gif',
               contentUrl: 'https://media.giphy.com/media/3o6vXJZlfNfAYysryo/giphy.gif',
               name: 'Stress'
            }
          ]
        });
};
