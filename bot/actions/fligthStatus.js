'use strict'

var builder = require('botbuilder');
var msg = require('../msg.json');
var byRoute = require('../../servicios/flightStatusByRoute.js');
var byNumber = require('../../servicios/flightStatusByNumber.js');
var logger = require('../../logs/logger.js');
var call;
var _number;
var _route;
var validar;

logger.debugLevel = 'debug';


module.exports = [

    (session, args) => {

        // recognizer entities

        // sDAte
        let sDate = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.datetimeV2.date');
        if (sDate) session.conversationData.sDate = sDate.resolution.values[0].value;
        //log.logger.debug('sDAte', session.conversationData.sDate);

        // sNumber
        let sNumber = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.number');
        if (sNumber) session.conversationData.sNumber = sNumber.resolution.value;
        //log.logger.debug('sNumber', session.conversationData.sNumber);

        let from = '';
        let to = '';
        let compositeEntities = args.intent.compositeEntities;
        let cityCode = builder.EntityRecognizer.findAllEntities(args.intent.entities, 'Ciudades');
        session.conversationData.control = '';

        logger.log('debug', session.conversationData.sNumber);
        session.userData.userName = "Kumar Sarma";
        session.save();

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
            console.log('AQUI');
            console.log(session.conversationData.destino);
            console.log('AQUI');
        }

        console.log('session.dialogData.origen ->',  session.conversationData.origen);
        console.log('session.dialogData.destino ->',  session.conversationData.destino);

        //console.log('ARGS ->', args);

        //************************ NEW FLOW *********************************************/


        validar = function () {

                    if(!session.conversationData.sDate) {
                        console.log('Ruta NO FECHA');
                        session.conversationData.pendiente = 'fecha';
                        session.endDialog(msg.status.getDate);
                    }

                    else if(session.conversationData.sNumber) {
                        console.log('Ruta DATE/NUMBER');
                        console.log(session.conversationData.sDate, session.conversationData.sNumber);

                        call = byNumber.api(session.conversationData.sDate, session.conversationData.sNumber);
                        call.then(function(result) {
                            _number = result;
                            console.log("Initialized _number");

                            if(_number.flights) {
                                session.send(`El estado del vuelo ${_number.flights[0].Vuelo}, es: ${_number.flights[0].Estado}`);
                            } else {
                                session.send(msg.status.noNumber);
                            }

                        }, function(err) {
                            console.log('ERR', err);
                        })

                        session.endConversation();
                    }

                    else if(session.conversationData.origen && session.conversationData.destino) {
                        console.log('flujo DATE/FROMandTO');
                        
                        console.log(session.conversationData.sDate, session.conversationData.origen, session.conversationData.destino);

                        call = byRoute.api(session.conversationData.sDate, session.conversationData.origen, session.conversationData.destino);

                        call.then(function(result) {
                            _route = result;
                            console.log("Initialized _route");

                            if(_route.flights) {
                                if (_route.flights.length > 1) {
                                    let msg = '';
                                    session.send('Listo, he encontrado mas de un vuelo, sigue abajo todos los estados:');
                                    for(let i=0; i < _route.flights.length; i++) {
                                        var d = new Date(_route.flights[i].FechaHoraLlegadaC);
                                        msg = `${msg}  <br/> El estado para el vuelo: ${_route.flights[i].Vuelo}, es: ${_route.flights[i].Estado}, Hora de confirmación: ${d.toTimeString().slice(0, 5)}`;
                                    }
                                    session.send(msg);
                                }
                            } else session.send(msg.status.noRoute);
                            

                        }, function(err) {
                            console.log('ERR', err);
                        })
                        
                        session.endConversation();
                    }

                    else {
                        if (from) {
                            console.log('Ruta DATE/FROM');
                            session.conversationData.pendiente = 'destino';
                            session.endDialog(msg.status.getTo);
                        }
                        if (to) {
                            console.log('Ruta DATE/TO');
                            session.conversationData.pendiente = 'origen';
                            session.endDialog(msg.status.getFrom);
                        }
                    }
            }
            
            validar();

        /* if (!session.conversationData.sDate) { //SI ENTIDAD NO FECHA;

                console.log('flujo NODATE');
                session.conversationData.pendiente = 'noFecha';
                session.endDialog(msg.status.getDate);

                if (session.conversationData.origen && session.conversationData.destino) {
                    session.endDialog(msg.status.getDate);
                    session.conversationData.pendiente = 'fecha_route';

                } else if (session.conversationData.sNumber) {
                    session.endDialog(msg.status.getDate);
                    session.conversationData.pendiente = 'fecha_number';
                } else {
                    session.send('Lo siento necesitamos mas información para consultar este vuelo');
                }

        } else if (session.conversationData.sDate && session.conversationData.sNumber) { //**SI ENTIDAD FECHA Y NUMERO;

                console.log('Ruta DATE/NUMBER');
                console.log(session.conversationData.sDate, session.conversationData.sNumber);

                call = byNumber.api(session.conversationData.sDate, session.conversationData.sNumber);
                call.then(function(result) {
                    _number = result;
                    console.log("Initialized _number");
                    //console.log(_number);

                    if(_number.flights) {
                        session.send(`El estado del vuelo ${_number.flights[0].Vuelo}, es: ${_number.flights[0].Estado}`);
                    } else {
                        session.send(msg.status.noNumber);
                    }

                }, function(err) {
                    console.log('ERR', err);
                })


        } else if (session.conversationData.sDate && session.conversationData.origen && session.conversationData.destino) { //**SI ENTIDAD FECHA Y RUTA;

                console.log('flujo DATE/FROMandTO');
                
                console.log(session.conversationData.sDate, session.conversationData.origen, session.conversationData.destino);

                call = byRoute.api(session.conversationData.sDate, session.conversationData.origen, session.conversationData.destino);

                call.then(function(result) {
                    _route = result;
                    console.log("Initialized _route");

                    if(_route.flights) {
                        if (_route.flights.length > 1) {
                            let msg = '';
                            session.send('Listo, he encontrado mas de un vuelo, sigue abajo todos los estados:');
                            for(let i=0; i < _route.flights.length; i++) {
                                var d = new Date(_route.flights[i].FechaHoraLlegadaC);
                                msg = `${msg}  <br/> El estado para el vuelo: ${_route.flights[i].Vuelo}, es: ${_route.flights[i].Estado}, Hora de confirmación: ${d.toTimeString().slice(0, 5)}`;
                            }
                            session.send(msg);
                        }
                    } else session.send(msg.status.noRoute);
                    

                }, function(err) {
                    console.log('ERR', err);
                })

        } else {
            if (session.conversationData.destino) {
                    console.log('Ruta DATE/TO');
                    session.conversationData.pendiente = 'origen';
                    session.endDialog(msg.status.getFrom);

                } else if (session.conversationData.origen) {
                    console.log('Ruta DATE/FROM');
                    session.conversationData.pendiente = 'destino';
                    session.endDialog(msg.status.getTo);

            }
        } */

    }

]