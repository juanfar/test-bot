'use strict'

var builder = require('botbuilder');
var msg = require('../msg.json');
var _fecha = require('../operaciones/fligthStatus.operations.js');
//var request_number = require('../../servicios/flightStatusByNumber.js');
//var request_route = require('../../servicios/flightStatusByRoute.js');
var _route;
var _number;
var call;
//request_number.api();

function callApi (date, number, from, to) {

    let urlA;

    console.log( 'NUMBER -> ', number);

    if (number != null) {
        urlA = `https://avapiacceturedesa.azure-api.net/api/integration/v1/flighstatusbynumber?flightNumber=${number}&flightDate=${date}`;
    } else urlA = `https://avapiacceturedesa.azure-api.net/api/integration/v1/flightstatuswithweather?origen=${from}&destino=${to}&fechaViajeDT=${date}`;

    console.log( 'URL -> ', urlA);

    const request = require('request');
    const options = {  
            url: urlA,
            method: 'GET',
            gzip: true,
            headers: {
            'Accept-Language': 'es',
            'x-channel': 'BOT',
            'x-correlation-id': 'UUID',
            'Ocp-Apim-Subscription-Key': 'c3e7baf5ccb1422986d4b1d5ef617f4f',
            'Accept-Encoding' : 'gzip'
        }
    };

    return new Promise(function(resolve, reject) {
    	// Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })

}

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

        console.log('SNUMBER->', sNumber.startIndex);

        if (this.sDate) {
            if (this.sFrom && this.sTo) {

                console.log(this.sDate.resolution.values[0].value, this.sFrom.resolution.values[0], this.sTo.resolution.values[0]);
                call = callApi(this.sDate.resolution.values[0].value, null, this.sFrom.resolution.values[0], this.sTo.resolution.values[0]);
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

            
            } else if (this.sNumber) {

                console.log(this.sDate.resolution.values[0].value, this.sNumber.entity);

                call = callApi(this.sDate.resolution.values[0].value, this.sNumber.entity, null, null);
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


            } else {

            this.control = 'getNumOrRou';
            builder.Prompts.text(session, msg.status.getNumOrRou);

            }


        } else if (this.sFrom && this.sTo) {
            this.control = 'getDateRoute';
            builder.Prompts.text(session, msg.status.getDate);

            
        } else if (this.sNumber) {
            this.control = 'getDateNumber';
            builder.Prompts.text(session, msg.status.getDate);

        } else {
            builder.Prompts.text(session, msg.status.getDate);
        }
    },
    (session, results) => {
        if (this.control == 'getDateNumber') {
            session.dialogData.fligthDate = results.response;

            let _date = _fecha.fecha(session.dialogData.fligthDate);

            console.log('FECHA ENTRADA-> ',_date);

            console.log(_date, this.sNumber.entity);

            call = callApi(_date, this.sNumber.entity, null, null);
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


        } else if (this.control == 'getDateRoute') {
            session.dialogData.fligthDate = results.response;

            let _date = _fecha.fecha(session.dialogData.fligthDate);

            console.log('FECHA ENTRADA-> ',_date);

            console.log(_date, this.sFrom.resolution.values[0], this.sTo.resolution.values[0]);

                call = callApi(_date, null, this.sFrom.resolution.values[0], this.sTo.resolution.values[0]);
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
           
        } else if (this.control == 'getNumOrRou') {

            session.dialogData.fligthNumber = results.response;
            session.send(`a4 -> El estado del vuelo No. ${session.dialogData.fligthNumber} de fecha ${this.sDate} con ruta ${this.sFrom ?`${this.sFrom}`:`BOG`} - ${this.sTo ?`${this.sTo}`:`MED`}, es: ${this.fstatus}`);

        } else {
            session.dialogData.fligthDate = results.response;
            builder.Prompts.text(session, msg.status.getNumOrRou);
        }
    },
    (session, results) => {
        session.dialogData.fligthNumber = results.response;
        // Process request and display reservation details
        session.send(`a5-> El estado del vuelo No. ${session.dialogData.fligthNumber}, de fecha ${session.dialogData.fligthDate}, es: ${this.fstatus}`);
        session.endDialog();
    }
];