'use strict'

var builder = require('botbuilder'); // importar modulo Bot framework
var msg = require('../../mensajes/msg.json'); // importar modulo de mensajes estaticos

module.exports = [

    (session, args) => {
        session.send(msg.greeting.greet);
    }

]