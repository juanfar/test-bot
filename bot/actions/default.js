'use strict'

var builder = require('botbuilder'); // importar modulo Bot framework
var msg = require('../../mensajes/msg.json'); // importar modulo de mensajes estaticos
var cMsg = require('../../mensajes/msg.js'); // importar modulo de mensajes dinámicos
var byRoute = require('../../servicios/flightStatusByRoute.js'); // importar modulo servicio consulta por ruta
var byNumber = require('../../servicios/flightStatusByNumber.js'); // importar modulo servicio consulta por numero
var fStatus = require('./fligthStatus.js'); // importar dialogo consulta de fligthStatus
var logger = require('../../logs/logger.js'); // importar modulo de logs
var context = require('../../context/context.json');
var call; // variable de llamada a los servicios
var _number; // variable de que almacena respuesta de servicio por numero
var _route; // variable de que almacena respuesta de servicio por ruta

module.exports = [

    (session, args) => {

        session.dialogData.context = context.none;

        // reconocimiento de entidades

        let sDate = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.datetimeV2.date');
        if (sDate) session.conversationData.sDate = sDate.resolution.values[0].value;

        let sNumber = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.number');
        if (sNumber) session.conversationData.sNumber = sNumber.resolution.value;

        //////////////////////////////

        console.log('NONE');
        console.log('Pendiente ->',  session.conversationData.pendiente);

        if (session.conversationData.pendiente == 'fecha') { // si me falta fecha

            if (session.conversationData.sNumber) {
                logger.info('info', 'Ruta DATE/NUMBER', 'None');
                logger.debug('debug', `Ruta DATE/NUMBER -> Fecha:${session.conversationData.sDate} -> Numero:${session.conversationData.sNumber}`, 'None');

                        call = byNumber.api(session.conversationData.sDate, session.conversationData.sNumber);

                        call.then(json => {
                            _number = json;

                            if(_number.flights) {
                                let message = cMsg.msgNumber(_number.flights);
                                session.send(message);
                            } else {
                                session.send(msg.status.noNumber);
                            }
                        })
                        .catch(err => console.error(err));

                        session.endConversation();

            } else if (session.conversationData.origen && session.conversationData.destino) {
                logger.info('info', 'flujo DATE/FROMandTO', 'None');
                logger.debug('debug', `flujo DATE/FROMandTO -> Fecha:${session.conversationData.sDate} -> Origen:${session.conversationData.origen} -> Destino:${session.conversationData.destino}`, 'None');

                call = byRoute.api(session.conversationData.sDate, session.conversationData.origen, session.conversationData.destino);

                call.then(json => {
                     _route = json;
            
                    if(_route.flights) {
                        if (_route.flights.length > 1) {
                            session.send(msg.status.findFligths);
                            let message = cMsg.msgRoute(_route.flights);
                            session.send(message);
                        }
                    } else session.send(msg.status.noRoute);
                })
                .catch(err => console.error(err));

                session.endConversation();

            } else {

                session.endDialog(msg.status.getNumOrRou);

                session.conversationData.pendiente == 'fecha'
                
                try {
                    let sTo = args.intent.entities[1].resolution.values[0];
                    logger.info('sTo***');
                    logger.debug('sTo***', sTo);
                    if(sTo) session.conversationData.origen = sTo;

                    let sFrom = args.intent.entities[0].resolution.values[0];
                    logger.info('sFrom***');
                    logger.debug('sFrom***', sFrom);

                    if(sFrom) session.conversationData.origen = sFrom;
                } catch(err) {
                    session.endDialog('lo siento');
                }
                

            }
        }

        else if (session.conversationData.pendiente == 'destino') { // si me falta destino

            let sTo = args.intent.entities[1].resolution.values[0]; // reconocimiento de entidad
            logger.info('info', 'Ruta TO', 'None');
            logger.debug('debug', `Ruta TO -> Destino:${sTo}`, 'None');

            if(sTo) session.conversationData.origen = sTo;

            call = byRoute.api(session.conversationData.sDate, session.conversationData.origen, session.conversationData.destino);

                call.then(json => {
                     _route = json;
            
                    if(_route.flights) {
                        if (_route.flights.length > 1) {
                            session.send(msg.status.findFligths);
                            let message = cMsg.msgRoute(_route.flights);
                            session.send(message);
                        }
                    } else session.send(msg.status.noRoute);
                })
                .catch(err => console.error(err));

            session.endConversation();
        }

        else if (session.conversationData.pendiente == 'origen') { // si me falta origen

            let sFrom = args.intent.entities[0].resolution.values[0];
            logger.info('info', 'Ruta FROM', 'None');
            logger.debug('debug', `Ruta FROM -> Destino:${sFrom}`, 'None');

            if(sFrom) session.conversationData.origen = sFrom;
                
                call = byRoute.api(session.conversationData.sDate, session.conversationData.origen, session.conversationData.destino);

                call.then(json => {
                     _route = json;
            
                    if(_route.flights) {
                        if (_route.flights.length > 1) {
                            session.send(msg.status.findFligths);
                            let message = cMsg.msgRoute(_route.flights);
                            session.send(message);
                        }
                    } else session.send(msg.status.noRoute);
                })
                .catch(err => console.error(err));

                session.endConversation();
        }
    }
]