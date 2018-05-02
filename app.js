/*-----------------------------------------------------------------------------
A simple Language Understanding (LUIS) bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify'); // importar modulo servidor
var builder = require('botbuilder'); // importar modulo Bot framework
var azure = require('botbuilder-azure');

// Intents
var fStatus = require('./bot/actions/fligthStatus.js'); // Dialogo consulta fligthStatus
var greet = require('./bot/actions/greeting.js'); // Dialogo Saludo
var login = require('./bot/actions/login.js'); // Dialogo autenticacion
var onDefault = require('./bot/actions/default.js'); // Dialogo none

// config
var config = require('./config.json'); // importar modulo configuraciones generales

// Setup Restify Server
var server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
 });

/* server.get('/login', restify.plugins.serveStatic({ // ruta para formulario autenticacion
	'directory': __dirname,
    'default': 'index.html'
})) */

server.get(/\/?.*/, restify.plugins.serveStatic({
    directory: './login',
    default: 'index.html'
  }))

  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({ 
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
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


bot.dialog('GreetingDialog', greet).triggerAction({ // inicia dialogo saludo
    matches: 'Greeting',
    intentThreshold: 0.8
})

bot.dialog('FligthStatusDialog', fStatus).triggerAction({ // inicia dialogo FligthStatus
    matches: 'FligthStatus'
})

bot.dialog('onDefault', onDefault).triggerAction({ // inicia dialogo None
    matches: 'None',
    intentThreshold: 0.1
})
  
bot.dialog('login', login).triggerAction({ // inicia dialogo autenticacion
    matches: 'logIn'
})