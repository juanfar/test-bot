'use strict'

var builder = require('botbuilder'); // importar modulo Bot framework
var msg = require('../../mensajes/msg.json'); // importar modulo de mensajes estaticos
var cMsg = require('../../mensajes/msg.js'); // importar modulo de mensajes dinámicos
var byRoute = require('../../servicios/flightStatusByRoute.js'); // importar modulo servicio consulta por ruta
var byNumber = require('../../servicios/flightStatusByNumber.js'); // importar modulo servicio consulta por numero
var logger = require('../../logs/logger.js'); // importar modulo de logs
var context = require('../../context/context.json');
var call; // variable de llamada a los servicios
var _number; // variable de que almacena respuesta de servicio por numero
var _route; // variable de que almacena respuesta de servicio por ruta
var validar;


module.exports = [

    (session, args) => {

        session.dialogData.context = context.fstatus;

        //////////////////////////////// reconocimiento de entidades //////////////////////////////

        // sDAte
        let sDate = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.datetimeV2.date');
        if (sDate) session.conversationData.sDate = sDate.resolution.values[0].value;

        // sNumber
        let sNumber = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.number');
        if (sNumber) session.conversationData.sNumber = sNumber.resolution.value;

        let from = '';
        let to = '';
        let compositeEntities = args.intent.compositeEntities;
        let cityCode = builder.EntityRecognizer.findAllEntities(args.intent.entities, 'Ciudades');
        session.conversationData.control = '';

        //logger.info('info', 'esta es una prueba con info', 'flightStatus');
        //logger.debug('debug', 'esta es una prueba con debug', 'flightStatus');

        try {
            for (let i = 0; i < compositeEntities.length; i++) {
                if (compositeEntities[i].children[0].type == undefined) {
                    compositeEntities[i].children[0] = {'type': null};
                }
                if (compositeEntities[i].parentType == 'Destino' && compositeEntities[i].children[0].type == 'Ciudades') {
                    to = compositeEntities[i].children[0].value;
                    session.conversationData.destino = compositeEntities[i].children[0].value;
                } else if (compositeEntities[i].parentType == 'Origen' && compositeEntities[i].children[0].type == 'Ciudades') {
                    from = compositeEntities[i].children[0].value;
                    session.conversationData.origen = compositeEntities[i].children[0].value;
                }
            }
       
            for (let i = 0; i < cityCode.length; i++) {
                if (cityCode[i].entity.toLowerCase() == to.toLowerCase()) {
                        session.conversationData.destino = cityCode[i].resolution.values[0];
                } else if (cityCode[i].entity.toLowerCase() == from.toLowerCase()) {
                        session.conversationData.origen = cityCode[i].resolution.values[0];
                }
            }

        } catch (err) {
            session.conversationData.origen = builder.EntityRecognizer.findAllEntities(args.intent.entities, 'Ciudades')[0].resolution.values[0];
            session.conversationData.destino = builder.EntityRecognizer.findAllEntities(args.intent.entities, 'Ciudades')[1].resolution.values[0];
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        validar = function () {

            if(!session.conversationData.sDate) {  // si no tengo fecha
                logger.info('info', 'Ruta NO FECHA', 'flightStatus');
                logger.debug('debug', 'Ruta NO FECHA', 'flightStatus');
                session.conversationData.pendiente = 'fecha';
                session.endDialog(msg.status.getDate);
            }

            else if(session.conversationData.sNumber) { // si tengo fecha y numero
                
                logger.info('info', 'Ruta DATE/NUMBER', 'flightStatus');
                logger.debug('debug', `Ruta DATE/NUMBER -> Fecha:${session.conversationData.sDate} -> Numero:${session.conversationData.sNumber}`, 'flightStatus');   

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
            }

            else if(session.conversationData.origen && session.conversationData.destino) { // si tengo fecha y ruta
                logger.info('info', 'flujo DATE/FROMandTO', 'flightStatus');
                logger.debug('debug', `flujo DATE/FROMandTO`, `Fecha: ${session.conversationData.sDate} -> Origen:${session.conversationData.origen} -> Destino:${session.conversationData.destino}`, 'flightStatus');

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

            else {
                if (from) { // si solo tengo fecha y origen
                    logger.info('info', 'Ruta FROM', 'flightStatus');
                    logger.debug('debug', `Ruta FROM -> Origen:${session.conversationData.origen}`, 'flightStatus');
                    session.conversationData.pendiente = 'destino';
                    session.endDialog(msg.status.getTo);
                }
                if (to) { // si solo tengo fecha y destino
                    logger.info('info', 'Ruta TO', 'flightStatus');
                    logger.debug('debug', `Ruta TO -> Destino:${session.conversationData.destino}`, 'flightStatus');
                    session.conversationData.pendiente = 'origen';
                    session.endDialog(msg.status.getFrom);
                }
            }
        }
            validar();
    }

]