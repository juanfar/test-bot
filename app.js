'use strict'

// This loads the environment variables from the .env file
//require('dotenv-extended').load();

var restify = require('restify');
var builder = require('botbuilder');
//var botbuilder_azure = require("botbuilder-azure");

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

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var model = 'https://eastus.api.cognitive.microsoft.com/luis/v2.0/apps/64f40c86-c107-4029-b252-d55babae9310?subscription-key=56501f9ed4df464aa7df835ae26c1d13&verbose=true&timezoneOffset=0&q=';

/* var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient); */

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);

var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });

//bot.set('storage', tableStorage);

bot.dialog('/', dialog);



//=========================================================
// Dialogos - utilizamos el mismo que short-app.js
//=========================================================


// Acá se manejan los intents
dialog.matches('Greeting', [require('./bot/actions/greeting.js')]);

dialog.matches('FligthStatus', require('./bot/actions/fligthStatus.js'));

//Este es el Default, cuando LUIS no entendió la consulta.
dialog.onDefault(builder.DialogAction.send(
    "No entendí. podrias repetir la solicitud por favor?"));