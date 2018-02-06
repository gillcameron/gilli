var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata
});

// Listen for messages from users
server.post('/api/messages', connector.listen());


// Create your bot with a function to receive messages from the user

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/f282c115-5f60-4753-8f7d-4e55989dfa0e?subscription-key=d6bd5a14a1f24144b77b3eb36913e1c1&verbose=true&timezoneOffset=0&q='


// Main dialog with LUIS
var bot = new builder.UniversalBot(connector, [


// var recognizer = new builder.LuisRecognizer(LuisModelUrl);
// var intents = new builder.IntentDialog({ recognizers: [recognizer] })
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
		session.send('Sad block');
                break;
            case'Happy':
		session.send('in Happy block');
                break;
                case'Okay':
    		session.send('in Okay block');
                    break;
                    case'None':
            session.send('in None block');
                        break;
             }
         }
       }
     )}


]);


//first prompt
bot.dialog('askForFeeling', [
    function (session) {
        builder.Prompts.text(session, "How are you feeling?");

    }
  ]);

/*
.matches('Sad', (session) => {
    session.send('You reached Sad intent, you said \'%s\'.', session.message.text);
})
.matches('Happy', (session) => {
    session.send('You reached Happy intent, you said \'%s\'.', session.message.text);
})
.matches('Okay', (session) => {
    session.send('You reached Okay intent, you said \'%s\'.', session.message.text);
})
.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
});

*/
