'use strict'

var builder = require('botbuilder'); // importar modulo Bot framework
var msg = require('../../mensajes/msg.json'); // importar modulo de mensajes estaticos
var context = require('../../context/context.json');

module.exports = [

    (session, args) => {

        session.dialogData.context = context.greet;

        session.send(msg.greeting.greet);
    }

]