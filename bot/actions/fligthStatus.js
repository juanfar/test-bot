var builder = require('botbuilder');
var msg = require('../msg.json');
var request_number = require('../../servicios/flightStatusByNumber.js');
var request_route = require('../../servicios/flightStatusByRoute.js');

//request_number.api();

module.exports = [(session, args, status) => {
        let sNumber = builder.EntityRecognizer.findEntity(args.entities, 'builtin.number');
        let sFrom = builder.EntityRecognizer.findAllEntities(args.entities, 'Ciudades');
        let sTo = builder.EntityRecognizer.findAllEntities(args.entities, 'Ciudades');
        let sDate = builder.EntityRecognizer.findEntity(args.entities, 'builtin.datetimeV2.date');
        let fstatus = 'Schedule';
        let dateTime = new Date(request_number.number.flights[0].FechaHoraSalidaP);
        this.control = '';


        console.log('from-> ',   request_number.number.flights[0].Destino);

        if (dateTime) this.dateTime = dateTime;
        if (sFrom.length > 0) this.sFrom = sFrom[0];
        if (sTo.length > 0) this.sTo = sTo[1];
        if (sDate) this.sDate = sDate;

         if (sNumber) {
            if (sNumber && sDate) {
                if (sNumber.startIndex !== sDate.startIndex) {
                    this.sNumber = sNumber.entity;
                }
            } else this.sNumber = sNumber.entity;
        }


        if (this.sDate) {
            if (this.sFrom && this.sTo) {

                if(this.sFrom.resolution.values[0] == request_number.number.flights[0].Origen && this.sTo.resolution.values[0] == request_number.number.flights[0].Destino && this.sDate.resolution.values[0].value == this.dateTime.toISOString().slice(0, -14)) {

                    session.send(`a1 -> El estado del vuelo entre ${this.sFrom.entity} y ${this.sTo.entity} con fecha ${this.sDate.entity}, es: ${request_number.number.flights[0].Estado}`);

               } else {
                   session.send(msg.status.noRoute);
               }
            
            } else if (this.sNumber) {


                if(this.sNumber == request_number.number.flights[0].Vuelo && this.sDate.resolution.values[0].value == this.dateTime.toISOString().slice(0, -14)) {
                    session.send(`a2 -> El estado del vuelo No. ${this.sNumber} de fecha ${this.sDate.entity}, es: ${request_number.number.flights[0].Estado}`);
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
    },
    (session, results) => {
        if (this.control == 'getDateNumber') {
            session.dialogData.fligthDate = results.response;

            if(this.sNumber == request_number.number.flights[0].Vuelo) {
                 session.send(`a3.1 -> El estado del vuelo No. ${this.sNumber} de fecha ${session.dialogData.fligthDate}, es: ${request_number.number.flights[0].Estado}`);
            } else {
                session.send(msg.status.noNumber);
            }
           
        } else if (this.control == 'getDateRoute') {
            session.dialogData.fligthDate = results.response;


            if(this.sFrom.resolution.values[0] == request_number.number.flights[0].Origen && this.sTo.resolution.values[0] == request_number.number.flights[0].Destino) {

                session.send(`a3.2 -> El estado del vuelo entre ${this.sFrom.entity} y ${this.sTo.entity} con fecha ${session.dialogData.fligthDate}, es: ${request_number.number.flights[0].Estado}`);

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
        session.dialogData.fligthNumber = results.response;
        // Process request and display reservation details
        session.send(`a5-> El estado del vuelo No. ${session.dialogData.fligthNumber}, de fecha ${session.dialogData.fligthDate}, es: ${this.fstatus}`);
        session.endDialog();
    }
];