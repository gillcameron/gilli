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
var bot = new builder.UniversalBot(connector);

// Create a recognizer for your LUIS model


dialog.matches('morningUpdate', 'morningUpdate');

bot.dialog('morningUpdate', [
    function (session, args, next) {

    }
]);

bot.dialog('/work', [
  function (session, args) {
    builder.LuisRecognizer.recognize(session.message.text, 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/f282c115-5f60-4753-8f7d-4e55989dfa0e?subscription-key=d6bd5a14a1f24144b77b3eb36913e1c1&verbose=true&timezoneOffset=0&q=', function (err, intents, entities) {
      var result = {};
      result.intents = intents;
      result.entities = entities;
      intents.forEach(function (intent) {
        if (intent.intent == 'morningUpdate') {
          session.beginDialog('morningUpdate', result);
        } else {
          // Do other stuff
        }
    });
});
}
]);
