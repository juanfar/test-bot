'use strict'

//var msg = require('./msg.json');

let msgRoute = function (routeFligth) {

    let msg = '';

    for(let i=0; i < routeFligth.length; i++) {
        let d = new Date(routeFligth[i].FechaHoraLlegadaC);
        msg = `${msg}  <br/> El estado para el vuelo: ${routeFligth[i].Vuelo}, es: ${routeFligth[i].Estado}, Hora de confirmación: ${d.toTimeString().slice(0, 5)}`;
    }

    return msg;
}

let msgNumber = function (numberFligth) {

    console.log('PRUEBA DESDE NUMBER');

    let msg = `El estado del vuelo ${numberFligth[0].Vuelo}, es: ${numberFligth[0].Estado}`;

    return msg;
}

module.exports = {
    msgRoute: msgRoute,
    msgNumber: msgNumber
}