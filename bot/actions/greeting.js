'use strict'

var builder = require('botbuilder');

module.exports = [

    (session, args) => {
        session.send('¿Hola, en que puedo ayudarte?');
    }

]