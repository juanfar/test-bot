'use strict'

var builder = require('botbuilder');
var msg = require('../msg.json');
var _fecha = require('../operaciones/fligthStatus.operations.js');
var byNumber = require('../../servicios/flightStatusByNumber.js');
var byRoute = require('../../servicios/flightStatusByRoute.js');
var _route;
var _number;
var call;

module.exports = [(session, args, status) => {
        let sNumber = builder.EntityRecognizer.findEntity(args.entities, 'builtin.number');
        let sFrom = builder.EntityRecognizer.findAllEntities(args.entities, 'Ciudades');
        let sTo = builder.EntityRecognizer.findAllEntities(args.entities, 'Ciudades');
        let sDate = builder.EntityRecognizer.findEntity(args.entities, 'builtin.datetimeV2.date');
        this.control = '';

        if (sFrom.length > 0) this.sFrom = sFrom[0];
        if (sTo.length > 0) this.sTo = sTo[1];
        if (sDate) this.sDate = sDate;

        /* if (sNumber) {
            if (sNumber && sDate) {
                if( sNumber.startIndex == sDate.startIndex) {
                    
                }
            }
        } */

        if (sNumber) this.sNumber = sNumber;

        if (this.sDate) {
            if (this.sFrom && this.sTo) {

                console.log('Ruta DATE/FROMandTO');
                console.log(this.sDate.resolution.values[0].value, this.sFrom.resolution.values[0], this.sTo.resolution.values[0]);

                call = byRoute.api(this.sDate.resolution.values[0].value, this.sFrom.resolution.values[0], this.sTo.resolution.values[0]);
                call.then(function(result) {
                    _route = result;
                    console.log("Initialized _route");

                    if(_route.flights) {
                        if (_route.flights.length > 1) {
                            session.send('Encontré los siguientes vuelos para esta ruta y fecha:');
                            for(let i=0; i < _route.flights.length; i++) {
                                session.send(`Numero de vuelo: ${_route.flights[i].Vuelo}, Estado: ${_route.flights[i].Estado}`);
                            }
                        }
                    } else session.send(msg.status.noRoute);
                    

                }, function(err) {
                    console.log('ERR', err);
                })

                this.sDate = '';
                this.sFrom = '';
                this.sTo = '';

            } else if (this.sNumber) {

                console.log('Ruta DATE/NUMBER');
                console.log(this.sDate.resolution.values[0].value, this.sNumber.entity);

                call = byNumber.api(this.sDate.resolution.values[0].value, this.sNumber.entity);
                call.then(function(result) {
                    _number = result;
                    console.log("Initialized _number");
                    //console.log(_number);

                    if(_number.flights) {
                        session.send(`El estado de este vuelo, es: ${_number.flights[0].Estado}`);
                    } else {
                        session.send(msg.status.noNumber);
                    }

                }, function(err) {
                    console.log('ERR', err);
                })

                this.sDate = '';
                this.sNumber = '';


            } else {

            console.log('Ruta DATE/NoRoute-NoNumber');
            this.control = 'getNumOrRou';
            builder.Prompts.text(session, msg.status.getNumOrRou);

            }

        } else if (this.sFrom && this.sTo) {

            console.log('Ruta FROMandTO');
            this.control = 'getDateRoute';
            builder.Prompts.text(session, msg.status.getDate);

            
        } else if (this.sNumber) {

            console.log('Ruta NUMBER');
            this.control = 'getDateNumber';
            builder.Prompts.text(session, msg.status.getDate);

        } else {
            console.log('?');
            builder.Prompts.text(session, msg.status.getDate);
        }
    },
    (session, results) => {
    
        if (this.control == 'getDateNumber') {
            console.log('Ruta NUMBER-> RES');
            session.dialogData.fligthDate = results.response;

            let _date = _fecha.fecha(session.dialogData.fligthDate);

            console.log('FECHA ENTRADA-> ',_date);

            console.log(_date, this.sNumber.entity);

            call = byNumber.api(_date, this.sNumber.entity);
            call.then(function(result) {
                _number = result;
                console.log("Initialized _number");
                //console.log(_number);

                if(_number.flights) {
                    session.send(`El estado de este vuelo, es: ${_number.flights[0].Estado}`);
                } else {
                    session.send(msg.status.noNumber);
                }
                
            }, function(err) {
                console.log('ERR', err);
            })

            _date = '';
            this.sNumber = '';

        } else if (this.control == 'getDateRoute') {
            console.log('Ruta ROUTE-> RES');
            session.dialogData.fligthDate = results.response;

            let _date = _fecha.fecha(session.dialogData.fligthDate);

            console.log('FECHA ENTRADA-> ',_date);

            console.log(_date, this.sFrom.resolution.values[0], this.sTo.resolution.values[0]);

                call = byRoute.api(_date, this.sFrom.resolution.values[0], this.sTo.resolution.values[0]);
                call.then(function(result) {
                    _route = result;
                    console.log("Initialized _route");
                    //console.log(_route);

                    if(_route.flights) {
                        if (_route.flights.length > 1) {
                            session.send('Encontré los siguientes vuelos para esta ruta y fecha:');
                            for(let i=0; i < _route.flights.length; i++) {
                                session.send(`Numero de vuelo: ${_route.flights[i].Vuelo}, Estado: ${_route.flights[i].Estado}`);
                            }
                        }
                    } else session.send(msg.status.noRoute);
                    

                }, function(err) {
                    console.log('ERR', err);
                })

                _date = '';
                this.sFrom = '';
                this.sTo = '';
           
        } else if (this.control == 'getNumOrRou') {


        } else {
            session.dialogData.fligthDate = results.response;
            builder.Prompts.text(session, msg.status.getNumOrRou);
        }
    },
    (session, results) => {
        console.log('Ruta NoDATE/NoRoute-NoNumber RES');
        session.dialogData.fligthNumber = results.response;
        // Process request and display reservation details
        session.send(`a5-> El estado del vuelo No. ${session.dialogData.fligthNumber}, de fecha ${session.dialogData.fligthDate}, es: ${this.fstatus}`);
        session.endDialog();
    }
];