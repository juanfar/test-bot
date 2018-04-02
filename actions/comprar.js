var builder = require('botbuilder');

module.exports = function(session, args) {
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