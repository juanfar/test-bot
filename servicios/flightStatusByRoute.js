'use strict'

var conf = require('./servicios.config.json');
var int = require('../integracion/int.js'); // importar modulo de integracion

var callApi = function (date, from, to) {

    let urlA = `${conf.ByRoute.url}${from}&destino=${to}&fechaViajeDT=${date}`;

    const request = require('request');

    let uuid = int.uuid();
    let timeS = new Date().toJSON().toString();
    let tuuid = `${uuid} ${timeS}`;
    
    const options = {  
            url: urlA,
            method: conf.ByRoute.method,
            gzip: true,
            headers: {
            'Accept-Language': conf.ByRoute.language,
            'x-channel': conf.ByRoute.channel,
            'x-correlation-id': tuuid,
            'Ocp-Apim-Subscription-Key': conf.ByRoute.sKey,
            'Accept-Encoding' : 'gzip',
            'cache-control': 'no-cache'
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

module.exports = {
    api: callApi
}