'use strict'

const builder = require('botbuilder');
const envx = require("envx");
let msg = require('../../msg.json');
let card = require('../../msg.js');
let app = require('../../../app.js')

module.exports = [

    (session) => {        
    
        var msg = new builder.Message(session) 
        .attachments([ 
            new builder.SigninCard(session) 
                .text("Por favor click en este link para consultar tus millas.") 
                .button("Ingresar", 'http://localhost:3978/login') 
        ]); 
        session.send(msg);
        //builder.Prompts.text(session, "Primero debes autenticarte para consultar tus millas");
        /* let user = app.sLogin.usuario;
        console.log('user ->', user); */

    }
]