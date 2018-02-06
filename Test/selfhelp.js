var builder = require('botbuilder');

var giphy = require('giphy-api')('DJHaPmj74hgVBdXSb0dVpmTVUASpRS3H');

var DialogLabels = {
    Sleep: 'for Sleep',
    Anxiety: ' for Anxiety',
    Stress: ' for Stress',
    Addiction: 'for Addiction'
};

module.exports = [
    function (session) {

      session.send("What would you like to view tips on?");
    //prompt a user for their option
  builder.Prompts.choice(
      session,
      'You can press',
      [DialogLabels.Sleep, DialogLabels.Anxiety, DialogLabels.Stress, DialogLabels.Addiction],
      {
          maxRetries: 3,
          retryPrompt: 'Not a valid option'
      });
},
function (session, result) {
  // switch to chosen dialog
  var selection = result.response.entity;
  switch (selection) {
      case DialogLabels.Sleep:
      session.send({
      attachments: [
                   {
                      contentType: 'image/gif',
                      contentUrl: 'https://media.giphy.com/media/ZLxRWG0vhzpiE/giphy.gif4',
                      name: 'Sleep'
                   }
                 ]
               });

           break;
        // return session.send("Sleep helps you to: Think clearer, maintain a healthy weight, and reduces stress!"), ("Sleep");
      case DialogLabels.Anxiety:
          return session.send('anxiety');
      case DialogLabels.Stress:
          return session.send('stress');
      case DialogLabels.Addiction:
          return session.send('addiction');
  }
}

];


//dialog files
/*
bot.dialog('sleep', require('./sleep'));
bot.dialog('anxiety', require('./anxiety'));
bot.dialog('stress', require('./stress'));
bot.dialog('addiction', require('./addiction'));
*/
