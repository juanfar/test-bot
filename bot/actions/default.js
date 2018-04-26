'use strict'

var builder = require('botbuilder');
var msg = require('../../mensajes/msg.json');
var cMsg = require('../../mensajes/msg.js');
var byRoute = require('../../servicios/flightStatusByRoute.js');
var byNumber = require('../../servicios/flightStatusByNumber.js');
var fStatus = require('./fligthStatus.js');
var call;
var _number;
var _route;


module.exports = [

    (session, args) => {
        let sDate = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.datetimeV2.date');
        if (sDate) session.conversationData.sDate = sDate.resolution.values[0].value;

        let sNumber = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.number');
        if (sNumber) session.conversationData.sNumber = sNumber.resolution.value;

        console.log('NONE');
        console.log('Pendiente ->',  session.conversationData.pendiente);

        if (session.conversationData.pendiente == 'fecha') {

            if (session.conversationData.sNumber) {
                logger.info('info', 'Ruta DATE/NUMBER', 'None');
                logger.debug('debug', `Ruta DATE/NUMBER -> Fecha:${session.conversationData.sDate} -> Numero:${session.conversationData.sNumber}`, 'None');

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

            } else if (session.conversationData.origen && session.conversationData.destino) {
                logger.info('info', 'flujo DATE/FROMandTO', 'None');
                logger.debug('debug', `flujo DATE/FROMandTO -> Fecha:${session.conversationData.sDate} -> Origen:${session.conversationData.origen} -> Destino:${session.conversationData.destino}`, 'None');

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

        else if (session.conversationData.pendiente == 'destino') {

            let sTo = args.intent.entities[1].resolution.values[0];
            logger.info('info', 'Ruta TO', 'None');
            logger.debug('debug', `Ruta TO -> Destino:${sTo}`, 'None');

            if(sTo) session.conversationData.origen = sTo;

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

        else if (session.conversationData.pendiente == 'origen') {

            let sFrom = args.intent.entities[0].resolution.values[0];
            logger.info('info', 'Ruta FROM', 'None');
            logger.debug('debug', `Ruta FROM -> Destino:${sFrom}`, 'None');

                if(sFrom) session.conversationData.origen = sFrom;

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

    }
]