'use strict'

var builder = require('botbuilder');
var msg = require('../msg.json');
var byRoute = require('../../servicios/flightStatusByRoute.js');
var byNumber = require('../../servicios/flightStatusByNumber.js');
var fStatus = require('./fligthStatus.1.js');
var call;
var _number;
var _route;


module.exports = [

    (session, args) => {
        let sDate = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.datetimeV2.date');
        if (sDate) session.conversationData.sDate = sDate.resolution.values[0].value;

        let sNumber = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.number');
        if (sNumber) session.conversationData.sNumber = sNumber.resolution.value;

        let sFrom = builder.EntityRecognizer.findAllEntities(args.intent.entities, 'Ciudades');
        console.log('sFrom***', sFrom[0]);
        //if(sFrom) session.conversationData.origen = sFrom[0].resolution.values[0];

        let sTo = builder.EntityRecognizer.findAllEntities(args.intent.entities, 'Ciudades');
        console.log('sTo***', sTo);
        //if(sto) session.conversationData.destino = sTo[1].resolution.values[0];

        console.log(session.conversationData.sDate);
        console.log(session.conversationData.sNumber);
        console.log(session.conversationData.origen);
        console.log(session.conversationData.destino);

        console.log('NONE');
        console.log('Pendiente ->',  session.conversationData.pendiente);

        if (session.conversationData.pendiente == 'fecha') {

            if (session.conversationData.sNumber) {

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

                        session.conversationData.sDate = null;
                        session.conversationData.sNumber = null;
                        session.conversationData.origen = null;
                        session.conversationData.destino = null;

            } else if (session.conversationData.origen && session.conversationData.destino) {
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

                            session.conversationData.sDate = null;
                            session.conversationData.sNumber = null;
                            session.conversationData.origen = null;
                            session.conversationData.destino = null;

            } else {
                session.endDialog(msg.status.getNumOrRou);
            }
        } 

        else if (session.conversationData.pendiente == 'destino') {
            console.log('destino');
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
        }

        else if (session.conversationData.pendiente == 'origen') {
            console.log('origen');

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
        }
        
       /*  if (session.conversationData.pendiente == 'origen') {
            console.log('ORIGEN');
            let city = builder.EntityRecognizer.findAllEntities(args.intent.entities, 'Ciudades');
            console.log('On default sDate ->',  session.conversationData.sDate);
            console.log('On default destino ->',  session.conversationData.destino);
            console.log('On default city', city[0].resolution.values[0]);
            
            console.log('flujo DATE/FROMandTO');
                
                console.log(session.conversationData.sDate, city[0].resolution.values[0], session.conversationData.destino);

                call = byRoute.api(session.conversationData.sDate, city[0].resolution.values[0], session.conversationData.destino);

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

        }

        if (session.conversationData.pendiente == 'destino') {
            console.log('DESTINO');
            let city = builder.EntityRecognizer.findAllEntities(args.intent.entities, 'Ciudades');
            console.log('On default sDate ->',  session.conversationData.sDate);
            console.log('On default destino ->',  session.conversationData.origen);
            console.log('On default city', city[0].resolution.values[0]);

            console.log('flujo DATE/FROMandTO');
                
                console.log(session.conversationData.sDate, session.conversationData.origen, city[0].resolution.values[0]);

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

        }

        if (session.conversationData.pendiente == 'fecha_route') {
            console.log('FECHA RUTA');
            let date = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.datetimeV2.date');
                
                console.log(date.resolution.values[0].value, session.conversationData.origen, session.conversationData.destino);

                call = byRoute.api(date.resolution.values[0].value, session.conversationData.origen, session.conversationData.destino);

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

        }

        if (session.conversationData.pendiente == 'fecha_number') {
            console.log('FECHA NUMBER');
            let date = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.datetimeV2.date');

                console.log(date.resolution.values[0].value, session.conversationData.sNumber);

                call = byNumber.api(date.resolution.values[0].value, session.conversationData.sNumber);
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


        }
        
        if (session.conversationData.pendiente = 'noFecha') {
            console.log('NO HAY FECHA');

            let date = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.datetimeV2.date');
            session.conversationData.sDate = date.resolution.values[0].value;

            let num = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.number');
            let destiny = builder.EntityRecognizer.findAllEntities(args.intent.entities, 'Ciudades');
            let origin = builder.EntityRecognizer.findAllEntities(args.intent.entities, 'Ciudades');


            if (session.conversationData.sDate) {
                if (session.conversationData.sNumber) {
                    console.log('1');
                    console.log('On default sDate ->',  date.resolution.values[0].value);
                    console.log('On default Number ->',  session.conversationData.sNumber);
        
                    console.log('Ruta DATE/NUMBER');
                        console.log(date.resolution.values[0].value, session.conversationData.sNumber);
        
                        call = byNumber.api(date.resolution.values[0].value, session.conversationData.sNumber);
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
                }
                else if (session.conversationData.origen && session.conversationData.destino) {

                    console.log('2');
    
                    console.log('On default sDate ->',  date.resolution.values[0].value);
                    console.log('On default destino ->',  session.conversationData.origen);
                    console.log('On default destino ->',  session.conversationData.destino);
        
                    console.log('DEfault DATE/FROMandTO');
                    
                    console.log(date.resolution.values[0].value, session.conversationData.origen, session.conversationData.destino);
    
                    call = byRoute.api(date.resolution.values[0].value, session.conversationData.origen, session.conversationData.destino);
    
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
                    console.log('3');
                    
                    let num = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.number');
                    let destiny = builder.EntityRecognizer.findAllEntities(args.intent.entities, 'Ciudades');
                    let origin = builder.EntityRecognizer.findAllEntities(args.intent.entities, 'Ciudades');

                    console.log(args.intent);
                    console.log(origin);
                    console.log(destiny);
                    console.log(num);
                    


                    if (num) session.conversationData.sNum = num.resolution.value;
                    if (origin[0].resolution.values[0]) session.conversationData.origen = origin[0].resolution.values[0];
                    if (destiny[1].resolution.values[0]) session.conversationData.destino = destiny[1].resolution.values[0];


                    session.conversationData.pendiente = 'noFecha';
                    session.endDialog(msg.status.getNumOrRou);
                }
            }
        } */
        
        /* session.send('On default'); */
    }

    
]