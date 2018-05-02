'use strict'

var azure = require('azure-storage');
const builder = require('botbuilder');
let msg = require('../../mensajes/msg.json');
let cMsg = require('../../mensajes/msg.js');


var res = 'no info';
var tableService = azure.createTableService('avibotarchcontext', 'sYH53B4BkiiAxmts9sZq9UJT+foKwA6P6VxOOjH7Eo28tGcQTm50kDpCs7rgclv3AozMTFuSsAAmRCuAuQ0yQA==');

module.exports = [

    (session) => {        
    
        var msg = new builder.Message(session) 
        .attachments([ 
            new builder.SigninCard(session) 
                .text("Por favor click en este link para consultar tus millas.") 
                .button("Ingresar", 'https://avi-bot-arch.azurewebsites.net') 
        ]); 
        //session.send(msg);
        builder.Prompts.text(session, msg);
    },
    function (session, results) {
        session.dialogData.auth = results.response;
        if (session.dialogData.auth == 'autenticado') {
            /* let acc_token = getToken();
            session.send(acc_token); */
            tableService.retrieveEntity('botdata', 'auth', 'access_token', function(error, result, response) {
                if (!error) {
                    session.send(response.body.access_token);
                }
            });
        }
    },
]