'use strict'

var conf = require('./servicios.config.json');
var int = require('../integracion/int.js'); // importar modulo de integracion


const callApi = function (date, number) {

    let urlA = `${conf.ByNumber.url}${number}&flightDate=${date}`;
    let uuid = int.uuid();
    let timeS = new Date().toJSON().toString();
    let tuuid = `${uuid} ${timeS}`;


    const options = {  
            url: urlA,
            method: conf.ByNumber.method,
            gzip: true,
            headers: {
            'Accept-Language': conf.ByNumber.language,
            'x-channel': conf.ByNumber.channel,
            'x-correlation-id': tuuid,
            'Ocp-Apim-Subscription-Key': conf.ByNumber.sKey,
            'Accept-Encoding' : 'gzip',
            'cache-control': 'no-cache'
        }
    };

    let sendInfo = int.openId(urlA, options);

    return sendInfo.then(res => res.json());
    
}

module.exports = {
    api: callApi
}

