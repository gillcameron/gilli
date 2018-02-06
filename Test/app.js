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
      var userIdentity = session.message.address.user.id;
              session.userData.Feeling = results.response;
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



bot.dialog('none',
[
  function (session) {
    session.send("Sorry I don't understand that, can you try again?")
    session.reset();
}


]);


  bot.dialog('sad', [
      function (session) {
              session.send(`You're feeling ${session.userData.Feeling}`);
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
               session.send(`You're feeling ${session.userData.Feeling}`);
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
                     session.send(`You're feeling ${session.userData.Feeling}`);
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

    /*

  builder.Prompts.choice(
      session,
      'You can press',
      [DialogLabels.Selfhelp, DialogLabels.Gad7],
      {
          maxRetries: 3,
          retryPrompt: 'Not a valid option'
      }); */
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

      bot.dialog('sleep', [
          function (session) {

        //    var sleepcontent = "select content from copingstrategies where copingName = 'Sleep'";
            session.send("To sleep better, maintain a routine, avoid alcohol and other stimulants late at night.");
        session.send("It also helps to avoid a heavy meal late at night.");
           session.send({
           attachments: [
                        {
                           contentType: 'image/gif',
                           contentUrl: 'https://media.giphy.com/media/ZLxRWG0vhzpiE/giphy.gif',
                           name: 'Sleeping'
                        }
                      ]
                    });

          }
        ]);

        bot.dialog('anxiety', [
            function (session) {
              session.send("Anxiety involves a frequent unpleasant feeling typically associated with uneasiness, apprehension and worry. It has physical, emotional and behavioural effects.");
              session.send("Light physical exercise such as a short stroll can tackle many of the symptoms of anxiety");
             session.send("Breathing exercises can be helpful and by relaxing both body and mind the cycle of stress and worry can be broken..");
             session.send({
             attachments: [
                          {
                             contentType: 'image/gif',
                             contentUrl: 'https://media.giphy.com/media/3oEduR6BxaE9undCIU/giphy.gif',
                             name: 'Anxiety'
                          }
                        ]
                      });

            }
          ]);


function getStresstip(callback)
{

executeQuery("SELECT content FROM copingstrategies WHERE category = 'stress' AND type ='tip' ORDER BY RAND() LIMIT 1", function (err, result) {
  if (err)
             callback(err,null);
         else
             callback(null,result[0].hexcode);
                     });


}



          bot.dialog('stress', [
              function (session) {
                getStresstip(function(data){
                            // code to execute on data retrieval

stresstip = data[0].content;


console.log(stresstip);

session.send(stresstip);

// console.log(tip);
// session.send(stresstip);

                });

 /*
                session.send("Stress can have a damaging effect on our bodies, our emotions and on how we think.");
                session.send("Mindfulness can help with the effects of stress.");
               session.send("Take a moment.... Check your watch and note the time. For the next 60 seconds try to focus all your attention on your breathing. Just your breathing. Just for one minute. Keep your eyes open and breathe normally. Your mind will start to wander but be ready to catch it and refocus on your breathing.");
            */   session.send({
               attachments: [
                            {
                               contentType: 'image/gif',
                               contentUrl: 'https://media.giphy.com/media/3o6vXJZlfNfAYysryo/giphy.gif',
                               name: 'Stress'
                            }
                          ]
                        });

              }
            ]);

            bot.dialog('addiction', [
                function (session) {
                  session.send("There are many ways to get help and support for potential substance addictions such as drugs or alcohol issues or behavioural addictions such as food or gambling.");
                  session.send("Once you have identified that you are struggling with a dependency or an addiction it is strongly advised not to prolong seeking help. This may feel daunting and confusing but it will reduce the impact on your life.");
                 session.send("Try talking to your partner, family or close friends about your feelings and concerns. It’s possible they are concerned about you already and want to help you get the support you need.");


                }
              ]);


// dialog files
bot.dialog('gad7', require('./gad7'));


// bot.dialog('selfhelp', require('./selfhelp'));
