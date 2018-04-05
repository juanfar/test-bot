const request = require('request');
var config = require('../servicios/servicios.config.json');
var _int = require('../integracion/intClass.js');
var json;

const options = {  
    url: `${config.ByRoute.url}?origen=BOG&destino=MDE&fechaViajeDT=2018-04-05`,
    method: config.ByRoute.method,
    gzip: true,
    headers: {
        'Accept-Language': 'es',
        'x-channel': 'BOT',
        'x-correlation-id': 'UUID',
        'Ocp-Apim-Subscription-Key': 'c3e7baf5ccb1422986d4b1d5ef617f4f',
        'Accept-Encoding' : 'gzip'
    }
};

/* request(options, function(err, res, body) {  
    json = JSON.parse(body);
    //console.log(json);
    module.exports.route = json;
}); */

const callApi = function() {
    request(options, function(err, res, body) {
        json = JSON.parse(body);
        //console.log(body);
        module.exports.route = json;
    });
}

module.exports = {
    api: callApi
}