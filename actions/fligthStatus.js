var txt_res = require('../bot/bot_res.json');
var builder = require('botbuilder');

module.exports = [ (session, args, status) => {
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
                    this.sNumber = sNumber.entity;
                }
            } else this.sNumber = sNumber.entity;
        }

        if (this.sDate) {
            if (this.sFrom && this.sTo) {
                session.send(`El estado del vuelo No. ${this.sNumber ?`${this.sNumber}`:`123`} de fecha ${this.sDate} con ruta ${this.sFrom} -  ${this.sTo}, es: ${this.fstatus}`);
            } else if (this.sNumber) {
            session.send(`El estado del vuelo No. ${this.sNumber} de fecha ${this.sDate} con ruta ${this.sFrom ?`${this.sFrom}`:`Lima`} - ${this.sTo ?`${this.sTo}`:`MED`}, es: ${this.fstatus}`);
            } else {
            this.control = 'getNumOrRou';
            builder.Prompts.text(session, "Por favor digite numero del vuelo o ruta");
            }
        } else if (this.sFrom && this.sTo) {
            this.control = 'getDate';
            builder.Prompts.text(session, );
        } else if (this.sNumber) {
            this.control = 'getDate';
            builder.Prompts.text(session, 'Por favor digite la fecha del vuelo (ej: Enero 1)');
        } else {
            builder.Prompts.text(session, 'Por favor digite la fecha del vuelo (ej: Enero 1)');
        }
    },
    (session, results) => {

        if (this.control == 'getDate') {
            session.dialogData.fligthDate = results.response;
            session.send(`El estado del vuelo No. ${this.sNumber ?`${this.sNumber}`:`123`} de fecha ${session.dialogData.fligthDate} con ruta ${this.sFrom ?`${this.sFrom.entity}`:`BOG`} - ${this.sTo ?`${this.sTo}`:`MED`}, es: ${this.fstatus}`);
        } else if (this.control == 'getNumOrRou') {
            session.dialogData.fligthNumber = results.response;
            session.send(`El estado del vuelo No. ${session.dialogData.fligthNumber} de fecha ${this.sDate} con ruta ${this.sFrom ?`${this.sFrom}`:`BOG`} - ${this.sTo ?`${this.sTo}`:`MED`}, es: ${this.fstatus}`);
        } else {
            session.dialogData.fligthDate = results.response;
            builder.Prompts.text(session, "Por favor digite numero de vuelo o ruta");
        }
    },
    (session, results) => {
        session.dialogData.fligthNumber = results.response;

        // Process request and display reservation details
        session.send(`El estado del vuelo No. ${session.dialogData.fligthNumber}, de fecha ${session.dialogData.fligthDate}, es: ${this.fstatus}`);
        session.endDialog();
    }
];