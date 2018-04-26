'use strict'

var builder = require('botbuilder');
var msg = require('../../mensajes/msg.json');
var cMsg = require('../../mensajes/msg.js');
var byRoute = require('../../servicios/flightStatusByRoute.js');
var byNumber = require('../../servicios/flightStatusByNumber.js');
var fsService = require('../../servicios/flightStatus.Service.js');
var logger = require('../../logs/logger.js');
var call;
var _number;
var _route;
var validar;


module.exports = [

    (session, args) => {

        // recognizer entities

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


        //************************ NEW FLOW *********************************************/


        validar = function () {

            if(!session.conversationData.sDate) {
                logger.info('info', 'Ruta NO FECHA', 'flightStatus');
                logger.debug('debug', 'Ruta NO FECHA', 'flightStatus');
                session.conversationData.pendiente = 'fecha';
                session.endDialog(msg.status.getDate);
            }

            else if(session.conversationData.sNumber) {
                logger.info('info', 'Ruta DATE/NUMBER', 'flightStatus');
                logger.debug('debug', `Ruta DATE/NUMBER -> Fecha:${session.conversationData.sDate} -> Numero:${session.conversationData.sNumber}`, 'flightStatus');

                /* call = fsService.byNumber(session.conversationData.sDate, session.conversationData.sNumber);
                console.log(call); */

                call = byNumber.api(session.conversationData.sDate, session.conversationData.sNumber);

                call.then(function(result) {
                    _number = result;
                    console.log("Initialized _number");

                    if(_number.flights) {
                        let message = cMsg.msgNumber(_number.flights);
                        session.send(message);
                    } else {
                        session.send(msg.status.noNumber);
                    }

                }, function(err) {
                    console.log('ERR', err);
                })

                session.endConversation();
            }

            else if(session.conversationData.origen && session.conversationData.destino) {
                logger.info('info', 'flujo DATE/FROMandTO', 'flightStatus');
                logger.debug('debug', `flujo DATE/FROMandTO`, `Fecha: ${session.conversationData.sDate} -> Origen:${session.conversationData.origen} -> Destino:${session.conversationData.destino}`, 'flightStatus');

                call = byRoute.api(session.conversationData.sDate, session.conversationData.origen, session.conversationData.destino);

                call.then(function(result) {
                    _route = result;
                    console.log("Initialized _route");

                    if(_route.flights) {
                        if (_route.flights.length > 1) {
                            session.send(msg.status.findFligths);
                            let message = cMsg.msgRoute(_route.flights);
                            session.send(message);
                        }
                    } else session.send(msg.status.noRoute);
                            

                }, function(err) {
                            console.log('ERR', err);
                })
                        
                session.endConversation();
            }

            else {
                if (from) {
                    logger.info('info', 'Ruta FROM', 'flightStatus');
                    logger.debug('debug', `Ruta FROM -> Origen:${session.conversationData.origen}`, 'flightStatus');
                    session.conversationData.pendiente = 'destino';
                    session.endDialog(msg.status.getTo);
                }
                if (to) {
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