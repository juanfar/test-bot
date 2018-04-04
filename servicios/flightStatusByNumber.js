const request = require('request');
var config = require('../integracion/config.json');
var _int = require('../integracion/intClass.js');
var json;

const options = {  
    url: `${config.ByNumber.url}?flightNumber=10&flightDate=2018-03-05`,
    method: config.ByRoute.method,
    headers: _int.openID
};

request(options, function(err, res, body) {
    //console.log(_int.securePost('www.google.com'));
    //json = JSON.parse(body);
    console.log('json ->', json);
    module.exports.json = json;
});
