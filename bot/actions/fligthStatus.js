var builder = require('botbuilder');
var msg = require('../msg.json');
var request_number;
var request_route;

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

        if (sFrom.length > 0) this.sFrom = sFrom[0].resolution.values;
        if (sTo.length > 0) this.sTo = sTo[1].resolution.values;
        if (sDate) this.sDate = sDate.entity;

         if (sNumber) {
            if (sNumber && sDate) {
                if (sNumber.entity.startIndex !== sDate.entity.startIndex) {
                    this.sNumber[0] = sNumber.entity;
                }
            } else this.sNumber = sNumber.entity;
        }
        this.sNumber = sNumber.entity;

        if (this.sDate) {
            if (this.sFrom && this.sTo) {
                request_route = require('../../servicios/flightStatusByRoute.js');
                if(request_route === undefined) {
                    session.send('temporalmente fuera de servicio');
                }
                session.send(`a1 ->  El estado del vuelo No. ${messages.sNumber ?`${messages.sNumber}`:`123`} de fecha ${messages.sDate} con ruta ${messages.sFrom} -  ${messages.sTo}, es: ${messages.fstatus}`);
            } else if (this.sNumber) {
                var fStatus = require('../msg.js');
                request_number = require('../../servicios/flightStatusByNumber.js');
                if(request_number === undefined) {
                    session.send('temporalmente fuera de servicio');
                }
                if(!request_number) {
                    session.send(msg.status.noService);
                }
                session.send(`a2 -> El estado del vuelo No. ${this.sNumber} de fecha ${this.sDate} con ruta ${this.sFrom ?`${this.sFrom}`:`Lima`} - ${this.sTo ?`${this.sTo}`:`MED`}, es: ${this.fstatus}`);
            } else {
            this.control = 'getNumOrRou';
            builder.Prompts.text(session, msg.status.getNumOrRou);
            }
        } else if (this.sFrom && this.sTo) {
            this.control = 'getDate';
            builder.Prompts.text(session, msg.status.getDate);
        } else if (this.sNumber) {
            this.control = 'getDate';
            builder.Prompts.text(session, msg.status.getDate);
        } else {
            builder.Prompts.text(session, msg.status.getDate);
        }
        return namer;
    },
    (session, results) => {

        if (this.control == 'getDate') {
            session.dialogData.fligthDate = results.response;
            session.send(`a3 -> El estado del vuelo No. ${this.sNumber ?`${this.sNumber}`:`123`} de fecha ${session.dialogData.fligthDate} con ruta ${this.sFrom ?`${this.sFrom.entity}`:`BOG`} - ${this.sTo ?`${this.sTo}`:`MED`}, es: ${this.fstatus}`);
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