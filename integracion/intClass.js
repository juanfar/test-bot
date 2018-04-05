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

    createUUID() {
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }
}

module.exports.integracion = Integracion;