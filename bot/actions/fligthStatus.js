var builder = require('botbuilder');
var msg = require('../msg.json');
request_number = require('../../servicios/flightStatusByNumber.js');
//request_route = require('../../servicios/flightStatusByRoute.js');
var request_route;
var operation = require('../operaciones/fligthStatus.operations.js');


var namer = 'amb';
module.exports.namer = namer;

module.exports = [(session, args, status) => {
        var namer = 'amb';
        let sNumber = builder.EntityRecognizer.findEntity(args.entities, 'builtin.number');
        let sFrom = builder.EntityRecognizer.findAllEntities(args.entities, 'Ciudades');
        let sTo = builder.EntityRecognizer.findAllEntities(args.entities, 'Ciudades');
        let sDate = builder.EntityRecognizer.findEntity(args.entities, 'builtin.datetimeV2.date');
        let fstatus = 'Schedule';
        this.control = '';

        if (sFrom.length > 0) this.sFrom = sFrom[0];
        if (sTo.length > 0) this.sTo = sTo[1];
        if (sDate) this.sDate = sDate;

         if (sNumber) {
            if (sNumber && sDate) {
                if (sNumber.startIndex !== sDate.startIndex) {
                    this.sNumber[0] = sNumber.entity;
                }
            } else this.sNumber = sNumber.entity;
        }
        //this.sNumber = sNumber.entity;

        if (this.sDate) {
            if (this.sFrom && this.sTo) {

                /* console.log('Origen1 ->', this.sFrom.resolution.values[0], 'destino ->', this.sTo.resolution.values[0]);
                console.log('Origen2 ->', request_number.num.data.flights[0].origin, 'destino ->', request_number.num.data.flights[0].destination); */

                if(this.sFrom.resolution.values[0] == request_number.num.data.flights[0].origin && this.sTo.resolution.values[0] == request_number.num.data.flights[0].destination && this.sDate.resolution.values[0].value.replace(/-/g, "") == request_number.num.data.flights[0].departureDateScheduled) {

                    session.send(`a1 -> El estado del vuelo entre ${this.sFrom.entity} y ${this.sTo.entity} con fecha ${this.sDate.entity}, es: ${request_number.num.data.flights[0].status}`);

               } else {
                   session.send(msg.status.noRoute);
               }
            
            } else if (this.sNumber) {

                /* console.log('Sdate ->', this.sDate.resolution.values[0].value.replace(/-/g, ""));
                console.log('Sdate2 ->',request_number.num.data.flights[0].departureDateScheduled); */

                if(this.sNumber == request_number.num.data.flights[0].flightNumber.slice(3) && this.sDate.resolution.values[0].value.replace(/-/g, "") == request_number.num.data.flights[0].departureDateScheduled) {
                    session.send(`a2 -> El estado del vuelo No. ${this.sNumber} de fecha ${this.sDate.entity}, es: ${request_number.num.data.flights[0].status}`);
               } else {
                   session.send(msg.status.noNumber);
               }


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
        return namer;
    },
    (session, results) => {
        if (this.control == 'getDateNumber') {
            session.dialogData.fligthDate = results.response;

            /* console.log('Number ->', request_number.num.data.flights[0].flightNumber.slice(3));
            console.log('Number2 ->', this.sNumber.toString()); */

            if(this.sNumber == request_number.num.data.flights[0].flightNumber.slice(3)) {
                 session.send(`a3.1 -> El estado del vuelo No. ${this.sNumber ?`${this.sNumber}`:`123`} de fecha ${session.dialogData.fligthDate}, es: ${request_number.num.data.flights[0].status}`);
            } else {
                session.send(msg.status.noNumber);
            }
           
        } else if (this.control == 'getDateRoute') {
            session.dialogData.fligthDate = results.response;

            console.log('Origen1 ->', this.sFrom.resolution.values[0], 'destino ->', this.sTo.resolution.values[0]);
            console.log('Origen2 ->', request_number.num.data.flights[0].origin, 'destino ->', request_number.num.data.flights[0].destination);

            if(this.sFrom.resolution.values[0] == request_number.num.data.flights[0].origin && this.sTo.resolution.values[0] == request_number.num.data.flights[0].destination) {

                session.send(`a3.2 -> El estado del vuelo entre ${this.sFrom.entity} y ${this.sTo.entity} con fecha ${session.dialogData.fligthDate}, es: ${request_number.num.data.flights[0].status}`);

            } else {
                session.send(msg.status.noRoute);
            }
           
        } else if (this.control == 'getNumOrRou') {

            session.dialogData.fligthNumber = results.response;
            session.send(`a4 -> El estado del vuelo No. ${session.dialogData.fligthNumber} de fecha ${this.sDate} con ruta ${this.sFrom ?`${this.sFrom}`:`BOG`} - ${this.sTo ?`${this.sTo}`:`MED`}, es: ${this.fstatus}`);

        } else {
            session.dialogData.fligthDate = results.response;
            builder.Prompts.text(session, msg.status.getNumOrRou);
        }
    },
    (session, results) => {
        var fnumber = require('../../integracion/flightStatusByNumber.js');
        session.dialogData.fligthNumber = results.response;
        // Process request and display reservation details
        session.send(`a5-> El estado del vuelo No. ${session.dialogData.fligthNumber}, de fecha ${session.dialogData.fligthDate}, es: ${this.fstatus}`);
        session.endDialog();
    }
];