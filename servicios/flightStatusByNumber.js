const request = require('request');
var config = require('../servicios/servicios.config.json');
var _int = require('../integracion/intClass.js');
var json;

const options = {  
    url: `${config.ByNumber.url}?flightNumber=10&flightDate=2018-03-05`,
    method: config.ByRoute.method,
    headers: {
        'Accept-Language': 'es',
        'x-channel': 'BOT',
        'x-correlation-id': 'UUID',
        'Ocp-Apim-Subscription-Key': 'c3e7baf5ccb1422986d4b1d5ef617f4f',
        'Accept-Encoding': 'gzip'
    }
};

request(options, function(err, res, body) {
    //console.logint.openID('www.google.com');
    json = JSON.parse(body);
    console.log(json);
    module.exports.num = json;
});
