'use strict'

var azure = require('azure-storage');
const builder = require('botbuilder');
var msg = require('../../mensajes/msg.json');
var cMsg = require('../../mensajes/msg.js');
var config = require('../../config.json'); // importar modulo configuraciones generales
var int = require('../../integracion/int.js'); // importar modulo de integracion
var context = require('../../context/context.json');


var tableService = azure.createTableService(config.azure.storageName, config.azure.storageKey);

module.exports = [

    (session) => {
        
        session.dialogData.context = context.login;
        
        session.conversationData.uuid = int.uuid();
        var mess = new builder.Message(session) 
        .attachments([ 
            new builder.SigninCard(session) 
                .text(msg.login.textMillas) 
                .button(msg.login.buttonMillas, `${config.webLink}?${session.conversationData.uuid}`) 
        ]); 
        //session.send(msg);
        builder.Prompts.text(session, mess);
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