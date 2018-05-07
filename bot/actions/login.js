'use strict'

var azure = require('azure-storage');
const builder = require('botbuilder');
let msg = require('../../mensajes/msg.json');
let cMsg = require('../../mensajes/msg.js');
var config = require('../../config.json'); // importar modulo configuraciones generales
var int = require('../../integracion/int.js'); // importar modulo de integracion
var context = require('../../context/context.json');


var tableService = azure.createTableService(config.azure.storageName, config.azure.storageKey);

module.exports = [

    (session) => {
        
        session.dialogData.context = context.login;
        
        session.conversationData.uuid = int.uuid();
        var msg = new builder.Message(session) 
        .attachments([ 
            new builder.SigninCard(session) 
                .text("Por favor click en este link para consultar tus millas.") 
                .button("Ingresar", `http://avi-bot-arch.azurewebsites.net?${session.conversationData.uuid}`) 
        ]); 
        //session.send(msg);
        builder.Prompts.text(session, msg);
    },
    (session, results) => {
        session.dialogData.auth = results.response;
        if (session.dialogData.auth == 'autenticado') {
            tableService.retrieveEntity(config.azure.table.auth, 'auth', session.conversationData.uuid, function(error, result, response) {
                if (!error) {
                    session.send(response.body.access_token);
                }
            });
        }
    },
]