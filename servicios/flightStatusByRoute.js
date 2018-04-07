
var callApi = function (date, from, to) {

    let urlA = `https://avapiacceturedesa.azure-api.net/api/integration/v1/flightstatuswithweather?origen=${from}&destino=${to}&fechaViajeDT=${date}`;

    const request = require('request');
    const options = {  
            url: urlA,
            method: 'GET',
            gzip: true,
            headers: {
            'Accept-Language': 'es',
            'x-channel': 'BOT',
            'x-correlation-id': 'UUID',
            'Ocp-Apim-Subscription-Key': 'c3e7baf5ccb1422986d4b1d5ef617f4f',
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