const request = require('request');
var config = require('../servicios/servicios.config.json');
var _int = require('../integracion/intClass.js');
var json;

const options = {  
    url: `${config.ByNumber.url}?flightNumber=10&flightDate=2018-03-05`,
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

/* const callApi = function() {
    request(options, function(err, res, body) {
        json = JSON.parse(body);
        //console.log(body);
        module.exports.number = json;
    });
} */

request(options, function(err, res, body) {
    json = JSON.parse(body);
    //console.log(body);
    module.exports.number = json;
});

/* module.exports = {
    api: callApi
} */

