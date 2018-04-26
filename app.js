/*-----------------------------------------------------------------------------
A simple Language Understanding (LUIS) bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var azure = require('botbuilder-azure'); 
var fStatus = require('./bot/actions/fligthStatus.js');
var greet = require('./bot/actions/greeting.js');
var signin = require('./bot/actions/signin/signin.js');
var onDefault = require('./bot/actions/default.js');


// Setup Restify Server
var server = restify.createServer();
server.use(restify.plugins.bodyParser());


/* server.post('/login', function (req, res) {
  this.user = req.body.usuario;
  console.log('user:', req.body.usuario);
  console.log('password:', req.body.password);
  res.send(200, JSON.stringify(req.body));
}); */

/* server.get('/login', (req, res) => {
    var body = '<html><body>hello</body></html>';
    res.writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/html'
    });
    res.write(body);
    res.end();
}); */

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



var tableName = "logs"; // You define
var storageName = "avibotarchcontext"; // Obtain from Azure Portal
var storageKey = "sYH53B4BkiiAxmts9sZq9UJT+foKwA6P6VxOOjH7Eo28tGcQTm50kDpCs7rgclv3AozMTFuSsAAmRCuAuQ0yQA=="; // Obtain from Azure Portal

var azureTableClient = new azure.AzureTableClient(tableName, storageName, storageKey);
var tableStorage = new azure.AzureBotStorage({gzipData: false}, azureTableClient);


var bot = new builder.UniversalBot(connector, { persistConversationData: true });

bot.set('storage', tableStorage);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://eastus.api.cognitive.microsoft.com/luis/v2.0/apps/64f40c86-c107-4029-b252-d55babae9310?subscription-key=56501f9ed4df464aa7df835ae26c1d13&verbose=true&timezoneOffset=0&q=';

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

