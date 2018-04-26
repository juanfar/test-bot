'use strict'

var msg = require('../../mensajes/msg.json');

var builder = require('botbuilder');

module.exports = [

    (session, args) => {
        session.send(msg.greeting.greet);
    }

]