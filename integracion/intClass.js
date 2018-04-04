"use strict";
 
class Integracion {
    constructor(url) {
        this.url = url;
    }
    openID() {
        // headers
        return headers = {
            'Accept-Language': 'es',
            'x-channel': 'BOT',
            'x-correlation-id': 'UUID',
            'Ocp-Apim-Subscription-Key': 'c3e7baf5ccb1422986d4b1d5ef617f4f',
            'gzip': true
        }
    }
    securePost() {
        console.log(this.url, 'desde SecurePos');
    }
}

module.exports.integracion = Integracion;