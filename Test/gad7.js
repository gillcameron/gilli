var builder = require('botbuilder');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gillibean123",
  database: "userlog"
});





var firstquestion = [];
var secondquestion = [];
var thirdquestion = [];
var fourthquestion = [];
var fifthquestion = [];
var sixthquestion = [];
var seventhquestion = [];
var score = [];

module.exports = [
    function (session) {
session.send("Over the last 2 weeks, how often have you been bothered by any of the following problems?");

    builder.Prompts.choice(
        session,
        `Feeling nervous, anxious or on edge? 0 - Not at all, 1 - Several days, 2 - More than half the days, 3 - Nearly every day`,
        ['0', '1', '2', '3'],
        {
            listStyle: builder.ListStyle.button,
            retryPrompt: `Please choose from the list of options`,
            maxRetries: 2,
        }
    );
},

(session, results, next) => {
          firstquestion = results.response.entity;

             next();
},

function (session) {

builder.Prompts.choice(
    session,
    `Not being able to stop or control worrying? 0 - Not at all, 1 - Several days, 2 - More than half the days, 3 - Nearly every day`,
    ['0', '1', '2', '3'],
    {
        listStyle: builder.ListStyle.button,
        retryPrompt: `Please choose from the list of options`,
        maxRetries: 2,
    }
);
},

(session, results, next) => {
 secondquestion = results.response.entity;
next();
},

function (session) {

builder.Prompts.choice(
    session,
    `Worrying too much about different things? 0 - Not at all, 1 - Several days, 2 - More than half the days, 3 - Nearly every day`,
    ['0', '1', '2', '3'],
    {
        listStyle: builder.ListStyle.button,
        retryPrompt: `Please choose from the list of options`,
        maxRetries: 2,
    }
);
},

(session, results, next) => {
  thirdquestion = results.response.entity;
next();
},

function (session) {

builder.Prompts.choice(
    session,
    `Trouble relaxing? 0 - Not at all, 1 - Several days, 2 - More than half the days, 3 - Nearly every day`,
    ['0', '1', '2', '3'],
    {
        listStyle: builder.ListStyle.button,
        retryPrompt: `Please choose from the list of options`,
        maxRetries: 2,
    }
);
},

(session, results, next) => {
  fourthquestion = results.response.entity;
next();
},

function (session) {

builder.Prompts.choice(
    session,
    `Being so restless that it is hard to sit still? 0 - Not at all, 1 - Several days, 2 - More than half the days, 3 - Nearly every day`,
    ['0', '1', '2', '3'],
    {
        listStyle: builder.ListStyle.button,
        retryPrompt: `Please choose from the list of options`,
        maxRetries: 2,
    }
);
},

(session, results, next) => {
 fifthquestion = results.response.entity;
next();
},

function (session) {

builder.Prompts.choice(
    session,
    `Becoming easily annoyed or irritable? 0 - Not at all, 1 - Several days, 2 - More than half the days, 3 - Nearly every day`,
    ['0', '1', '2', '3'],
    {
        listStyle: builder.ListStyle.button,
        retryPrompt: `Please choose from the list of options`,
        maxRetries: 2,
    }
);
},

(session, results, next) => {
 sixthquestion = results.response.entity;
next();
},

function (session) {

builder.Prompts.choice(
    session,
    `Feeling afraid as if something awful might happen? 0 - Not at all, 1 - Several days, 2 - More than half the days, 3 - Nearly every day`,
    ['0', '1', '2', '3'],
    {
        listStyle: builder.ListStyle.button,
        retryPrompt: `Please choose from the list of options`,
        maxRetries: 2,
    }
);
},

(session, results, next) => {
   seventhquestion = results.response.entity;
   score = +firstquestion + +secondquestion + +thirdquestion + +fourthquestion + +fifthquestion + +sixthquestion + +seventhquestion;
  console.log(score);
  var sql = "insert into gad7userlog (score, userID) values ('"+score+"', '"+session.message.address.user.id+"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
   session.send(`Your score is ${score}`);
   next();
},

function (session) {

if (score >= 0 && score <= 4) {
  session.send("Normal");
}
else if (score >= 5 && score <= 9)
{
  session.send("Mild");
}
else if (score >= 10 && score <= 14)
{
  session.send("Moderate");
}
else {
    session.send("Severe");
}

}


];

/*
      var adaptiveCardMessage = new builder.Message(session)
   .addAttachment({
       contentType: "application/vnd.microsoft.card.adaptive",
       content: {
           type: "AdaptiveCard",
              body: [
                   {
                       "type": "TextBlock",
                       "text": "Feeling nervous, anxious or on edge?",
                       "size": "medium",
                   },

                   {
      "type": "Input.ChoiceSet",
      "id": "SingleSelectVal",
      "style": "expanded",
      "choices": [
        {
          "title": "Not at all",
          "value": "0"
        },
        {
          "title": "Several days",
          "value": "1"
        },
        {
          "title": "More than half the days",
          "value": "2"
        },
        {
          "title": "Nearly every day",
          "value": "3"
        }
      ]
    },
               ],

       }
   });

   session.send(adaptiveCardMessage);
   */
