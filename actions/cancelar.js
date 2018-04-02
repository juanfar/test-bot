var builder = require('botbuilder');

module.exports = function(session, args) {
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