"use strict";
var restify = require('restify');
var builder = require('botbuilder');
var https = require('https');
var rp = require('request-promise');
var azure = require('botbuilder-azure');
var mysql = require('mysql');
var giphy = require('giphy-api')('DJHaPmj74hgVBdXSb0dVpmTVUASpRS3H');
var stresstip;
var tip;

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



//connect to restify server and set port
 var server = restify.createServer();
 server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
 });

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
appId: process.env.MICROSOFT_APP_ID,
appPassword: process.env.MICROSOFT_APP_PASSWORD
});


// Listen for messages from users
server.post('/api/messages', connector.listen());

var inMemoryStorage = new builder.MemoryBotStorage();

//labels for buttons
var DialogLabels = {
    Gad7: 'Mood checker',
    Selfhelp: 'Self Help',
        Sleep: 'Sleep',
        Anxiety: 'Anxiety',
        Stress: 'Stress',
        Addiction: 'Addiction'
    };

// LUIS
const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/f282c115-5f60-4753-8f7d-4e55989dfa0e?subscription-key=d6bd5a14a1f24144b77b3eb36913e1c1&verbose=true&timezoneOffset=0&q='


// USER ID! session.message.address.user.id

//Main Dialog

var bot = new builder.UniversalBot(connector, [

    function (session) {
        session.send("Hello! I'm the InspireBot.");
        console.log(session.userData + " - Username");
        session.beginDialog('askForFeeling');
    },


// take how the user is feeling and match to correct intent using LUIS
    function (session, results) {
      builder.LuisRecognizer.recognize(results.response, LuisModelUrl,
    function (err, intents, entities) {
        if (err) {
          console.log("Some error occurred in calling LUIS");
        }
   else {
             switch (intents[0].intent) {
                     case'Sad':
                     session.beginDialog('sad');
                     break;
                     case'Happy':
                     session.beginDialog('happy');
                     break;
                     case'Okay':
                     session.beginDialog('okay');
                     break;
                     case'None':
                     session.beginDialog('none');
                     break;
             }
         }
       }
        )

        //insert users mood into database
      var userIdentity = session.message.address.user.id;
              session.userData.Feeling = results.response;
                session.send(`You're feeling ${session.userData.Feeling}`);
              console.log(session.userData.Feeling + " - feeling ");
               executeQuery("insert into users(feeling, userID) values ('"+session.userData.Feeling+"', '"+session.message.address.user.id+"')", function(result){
console.log(result);
               });

    },

/*
//if session.userData.Feeling is good/bad begin different Dialogs

*/

]);
// Enable Conversation Data persistence
bot.set('persistConversationData', true);
bot.set('storage', inMemoryStorage);


//Bot Dialogs

//first prompt
bot.dialog('askForFeeling', [
    function (session) {
        builder.Prompts.text(session, "How are you feeling?");

    }
  ]);


// if the user types something the bot cannot understand - reaches the none intent
bot.dialog('none',
[
  function (session) {
    session.send("Sorry I don't understand that, can you try again?")
    session.reset();
}


]);


  bot.dialog('sad', [
      function (session) {

              session.send({
              attachments: [
                           {
                              contentType: 'image/gif',
                              contentUrl: 'https://media.giphy.com/media/TZBED1pP5m8N2/giphy.gif',
                              name: 'SadCat'
                           }
                         ]
                       });

                       session.beginDialog('choice');
      }
    ]);


      bot.dialog('happy', [
          function (session) {

               session.send({
               attachments: [
                            {
                               contentType: 'image/gif',
                               contentUrl: 'https://media.giphy.com/media/3NtY188QaxDdC/giphy.gif',
                               name: 'Slothy'
                            }
                          ]
                        });

                        session.beginDialog('choice');

          }
        ]);

          bot.dialog('okay', [
              function (session) {
                     session.send({
                     attachments: [
                                  {
                                     contentType: 'image/gif',
                                     contentUrl: 'https://media.giphy.com/media/U3qFDxzlmOwJG/giphy.gif',
                                     name: 'Fine'
                                  }
                                ]
                              });

                              session.beginDialog('choice');

              }
            ]);




bot.dialog('choice', [
  function (session) {
    //prompt a user for their option

    builder.Prompts.choice(
        session,
      'What would you like to do today?',
        [DialogLabels.Selfhelp, DialogLabels.Gad7],
        {
            listStyle: builder.ListStyle.button,
            retryPrompt: `Please choose from the list of options`,
            maxRetries: 2,
        }

    );
},


function (session, result) {
  // switch to chosen dialog
  var selection = result.response.entity;
  switch (selection) {
      case DialogLabels.Selfhelp:
          return session.beginDialog('selfhelp');
      case DialogLabels.Gad7:
          return session.beginDialog('gad7');
  }
}

])
.reloadAction('startOver', 'Ok, starting over.', {
    matches: /^start over$/i
  });


bot.dialog('selfhelp', [
        function (session) {
        //prompt a user for their choice
        builder.Prompts.choice(
          session,
          'What would you like to view tips on?',
          [DialogLabels.Sleep, DialogLabels.Anxiety, DialogLabels.Stress, DialogLabels.Addiction],
          {
            listStyle: builder.ListStyle.button,
              maxRetries: 3,
              retryPrompt: 'Not a valid option'
          });
        },
        function (session, result) {
        // switch to chosen dialog
        var selection = result.response.entity;
        switch (selection) {
          case DialogLabels.Sleep:
            return session.beginDialog('sleep');
          case DialogLabels.Anxiety:
              return session.beginDialog('anxiety');
          case DialogLabels.Stress:
              return session.beginDialog('stress');
          case DialogLabels.Addiction:
              return session.beginDialog('addiction');
        }
        }

      ]);

// dialog files
bot.dialog('gad7', require('./gad7'));
bot.dialog('sleep', require('./sleep'));
bot.dialog('stress', require('./stress'));
bot.dialog('addiction', require('./addiction'));
bot.dialog('anxiety', require('./anxiety'));

// bot.dialog('selfhelp', require('./selfhelp'));
