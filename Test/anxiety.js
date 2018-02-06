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
  function getAnxietytip(callback)
  {

  executeQuery("SELECT content FROM copingstrategies WHERE category = 'anxiety' AND type ='tip' ORDER BY RAND() LIMIT 1", function (err, result) {
    if (err)
               callback(err,null);
           else
               callback(null,result[0].hexcode);
                       });


  }

getAnxietytip(function(data){
            // code to execute on data retrieval

anxietytip = data[0].content;


console.log(anxietytip);

session.send(anxietytip);

});



 session.send({
 attachments: [
              {
                 contentType: 'image/gif',
                 contentUrl: 'https://media.giphy.com/media/3oEduR6BxaE9undCIU/giphy.gif',
                 name: 'Anxiety'
              }
            ]
          });
};
