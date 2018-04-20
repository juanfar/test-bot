'use strict'

var int = require('../integracion/int.js');
var config = require('../config.json');

const _callLogin = function (user, password) {
    
    let url = config.auth.url;

    let headers = {
      "Ocp-Apim-Subscription-Key": "3ffbb0671f5f44038afbc755eb6ac859",
      "Accept-Language": "es",
      "Content-Type" : "application/json"
    }

    let body = {
      "user": user,
      "password": password,
      "type": "lifemiles"
    }

    let callAuth = int.authCall(url, headers, body);

    callAuth.then(function(result) {
        console.log(result)

      }, function(err) {
          console.log('ERR', err);
      })
}

module.exports = {
    login: _callLogin,
}