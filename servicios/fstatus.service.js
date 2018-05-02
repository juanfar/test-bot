'use strict'

conf = require('./servicios.config.json');

const _callNumber = function (date, number) {

    let urlA = `${conf.byNumber.url}${number}&flightDate=${date}`;

    const request = require('request');

    const headers = {
        'Accept-Language': conf.byNumber.language,
        'x-channel': conf.byNumber.channel,
        'x-correlation-id': 'UUID',
        'Ocp-Apim-Subscription-Key': conf.byNumber.sKey,
        'Accept-Encoding' : 'gzip',
        'cache-control': 'no-cache'
    }
    const options = {  
            url: urlA,
            method: conf.byNumber.method,
            gzip: true,
            headers: headers
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

const _callRoute = function (date, from, to) {

    let urlA = `${conf.byRoute.url}${from}&destino=${to}&fechaViajeDT=${date}`;

    const request = require('request');

    const headers = {
        'Accept-Language': conf.byRoute.language,
        'x-channel': conf.byRoute.channel,
        'x-correlation-id': 'UUID',
        'Ocp-Apim-Subscription-Key': conf.byRoute.sKey,
        'Accept-Encoding' : 'gzip',
        'cache-control': 'no-cache'
    }
    const options = {  
            url: urlA,
            method: conf.byRoute.method,
            gzip: true,
            headers: headers
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
    callNumber: _callNumber,
    callRoute: _callRoute
}

