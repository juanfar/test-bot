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
            (session, args, status) => {
                let sNumber = builder.EntityRecognizer.findEntity(args.entities, 'builtin.number');
                let sFrom = builder.EntityRecognizer.findAllEntities(args.entities, 'Ciudades');
                let sTo = builder.EntityRecognizer.findAllEntities(args.entities, 'Ciudades');
                let sDate = builder.EntityRecognizer.findEntity(args.entities, 'builtin.datetimeV2.date');
                let fstatus = 'Schedule';
                this.control = '';
                if (sFrom.length > 0) this.sFrom = sFrom[0].resolution.values;
                if (sTo.length > 0) this.sTo = sTo[1].resolution.values;
                if (sDate) this.sDate = sDate.entity;

                if (sNumber) {
                    if (sNumber && sDate) {
                        if (sNumber.entity.startIndex !== sDate.entity.startIndex) {
                            this.sNumber = sNumber.entity;
                        }
                    } else this.sNumber = sNumber.entity;
                }

                if (this.sDate) {
                    if (this.sFrom && this.sTo) {
                        session.send(`El estado del vuelo No. ${this.sNumber ?`${this.sNumber}`:`123`} de fecha ${this.sDate} con ruta ${this.sFrom} -  ${this.sTo}, es: ${this.fstatus}`);
            } else if (this.sNumber) {
                session.send(`El estado del vuelo No. ${this.sNumber} de fecha ${this.sDate} con ruta ${this.sFrom ?`${this.sFrom}`:`Lima`} - ${this.sTo ?`${this.sTo}`:`MED`}, es: ${this.fstatus}`);
            } else {
                this.control = 'getNumOrRou';
                builder.Prompts.text(session, "Por favor digite numero del vuelo o ruta");
            }
        } else if (this.sFrom && this.sTo) {
            this.control = 'getDate';
            builder.Prompts.text(session, 'Por favor digite la fecha del vuelo (ej: Enero 1)');
        } else if (this.sNumber) {
            this.control = 'getDate';
            builder.Prompts.text(session, 'Por favor digite la fecha del vuelo (ej: Enero 1)');
        } else {
            builder.Prompts.text(session, 'Por favor digite la fecha del vuelo (ej: Enero 1)');
        }
    },
    (session, results) => {

        if (this.control == 'getDate') {
            session.dialogData.fligthDate = results.response;
            session.send(`El estado del vuelo No. ${this.sNumber ?`${this.sNumber}`:`123`} de fecha ${session.dialogData.fligthDate} con ruta ${this.sFrom ?`${this.sFrom.entity}`:`BOG`} - ${this.sTo ?`${this.sTo}`:`MED`}, es: ${this.fstatus}`);
        } else if (this.control == 'getNumOrRou') {
            session.dialogData.fligthNumber = results.response;
            session.send(`El estado del vuelo No. ${session.dialogData.fligthNumber} de fecha ${this.sDate} con ruta ${this.sFrom ?`${this.sFrom}`:`BOG`} - ${this.sTo ?`${this.sTo}`:`MED`}, es: ${this.fstatus}`);
        } else {
            session.dialogData.fligthDate = results.response;
            builder.Prompts.text(session, "Por favor digite numero de vuelo o ruta");
        }
    },
    (session, results) => {
        session.dialogData.fligthNumber = results.response;

        // Process request and display reservation details
        session.send(`El estado del vuelo No. ${session.dialogData.fligthNumber}, de fecha ${session.dialogData.fligthDate}, es: ${this.fstatus}`);
        session.endDialog();
    }
]);

//Este es el Default, cuando LUIS no entendió la consulta.
dialog.onDefault(builder.DialogAction.send(
    "No entendí. podrias repetir la solicitud por favor?"));