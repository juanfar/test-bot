/*-----------------------------------------------------------------------------
A simple Language Understanding (LUIS) bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');

// Intents
var azure = require('botbuilder-azure'); 
var fStatus = require('./bot/actions/fligthStatus.js');
var greet = require('./bot/actions/greeting.js');
var signin = require('./bot/actions/signin.js');
var onDefault = require('./bot/actions/default.js');

// config
var config = require('./config.json');

// Setup Restify Server
var server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.get('/login', restify.plugins.serveStatic({
	'directory': __dirname,
    'default': 'index.html'
}))


server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: null,
    appPassword: null,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());



var tableName = config.azure.tableName; // You define
var storageName = config.azure.storageName; // Obtain from Azure Portal
var storageKey = config.azure.storageKey; // Obtain from Azure Portal

var azureTableClient = new azure.AzureTableClient(tableName, storageName, storageKey);
var tableStorage = new azure.AzureBotStorage({gzipData: false}, azureTableClient);


var bot = new builder.UniversalBot(connector, { persistConversationData: true });

bot.set('storage', tableStorage);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = config.luis.url;

// Create a recognizer that gets intents from LUIS, and add it to the bot
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);


//=========================================================
// Bots Dialogs
//=========================================================


bot.dialog('GreetingDialog', greet).triggerAction({
    matches: 'Greeting',
    intentThreshold: 0.9
})

bot.dialog('FligthStatusDialog', fStatus).triggerAction({
    matches: 'FligthStatus'
})

bot.dialog('onDefault', onDefault).triggerAction({
    matches: 'None',
    intentThreshold: 0.1
})
  
bot.dialog('signin', signin).triggerAction({
    matches: 'signIn'
}) 

