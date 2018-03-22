var restify = require('restify');
var builder = require('botbuilder');
var flight = require('./data/flights.js');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

// No te preocupes por estas credenciales por ahora.
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Crear un procesador LUIS que apunte a nuestro modelo en el root (/)
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/64f40c86-c107-4029-b252-d55babae9310?subscription-key=2f230fb39a3d48c1b82161f3fb306966&verbose=true&q=';

var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

//=========================================================
// Dialogos - utilizamos el mismo que short-app.js
//=========================================================

var inMemoryStorage = new builder.MemoryBotStorage();

// Acá se manejan los intents
dialog.matches('Greeting', [
    function(session, args) {
        session.send('¿En que puedo ayudar?');
    }
]);

dialog.matches('comprar', [
    function(session, args) {
        // Extraer las entidades pasadas por LUIS
        let boleto = builder.EntityRecognizer.findEntity(args.entities, 'boleto');
        let serv = builder.EntityRecognizer.findEntity(args.entities, 'servicios_especiales');
        let respuesta = '';

        if (boleto) {
            respuesta = 'Genial, procesaremos su compra de boleto';
        } else if (serv) {
            respuesta = 'Genial, procesaremos su compra de servicios adicionales';
        }
        session.send(respuesta);
    }
]);

dialog.matches('cancelar', [
    function(session, args) {
        // Extraer las entidades pasadas por LUIS
        let boleto = builder.EntityRecognizer.findEntity(args.entities, 'boleto');
        let serv = builder.EntityRecognizer.findEntity(args.entities, 'servicios_especiales');
        let respuesta = '';

        if (boleto) {
            respuesta = 'Ok no hay problema, cancelaremos su compra de boleto';
        } else if (serv) {
            respuesta = 'Ok no hay problema, cancelaremos su compra de servicios adicionales';
        }
        session.send(respuesta);
    }
]);

dialog.matches('FligthStatus', [
    function(session) {
        builder.Prompts.text(session, "Por favor digite la fecha del vuelo (ej: Enero 1)");
    },
    function(session, results) {
        session.dialogData.fligthDate = results.response;
        builder.Prompts.number(session, "Por favor digite el numero del vuelo   ");
    },
    function(session, results, status) {
        session.dialogData.numberFligth = results.response;
        let fstatus = flight.status;

        // Process request and display reservation details
        session.send(`El estado del vuelo No. ${session.dialogData.numberFligth} de fecha ${session.dialogData.fligthDate}, es: ${fstatus}`);
        session.endDialog();
    }
]);

//Este es el Default, cuando LUIS no entendió la consulta.
dialog.onDefault(builder.DialogAction.send(
    "No entendí. podrias repetir la solicitud por favor?"));