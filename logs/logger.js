'use strict'

var azure = require('azure-storage'); // importar modulo Bot framework
var int = require('../integracion/int.js'); // importar modulo de integracion
var config = require('../config.json'); // importar modulo configuraciones generales
var logConf = require('./logConfig.json');

var logger = exports;

  logger.info = function(level, message, operation) { // funcion que genera log y hace request POST en la API de logs

    let uuid = int.uuid();
    let timeS = new Date().toJSON().toString();
    let tuuid = `${uuid} ${timeS}`;

    let headers = {
      "x-correlation-id": tuuid,
      "x-channel": logConf.info.channel,
      "Ocp-Apim-Trace" : true,
      "Ocp-Apim-Subscription-Key": logConf.info.sKey
    };

    let body = {
      "timestamp": timeS,
      "level": level,
      "message": message,
      "operation": operation
    };

    let options = {  
      url: config.logs.url,
      method: config.logs.method,
      headers: headers,
      body: JSON.stringify(body)
    };

    let sendInfo = int.sendLogInfo(options);

    sendInfo.then(function(result) {

      }, function(err) {
          console.log('ERR', err);
      })

  }

  logger.debug = function(level, sce, message, operation) { // funcion que genera log y hace request POST en azure storage

    let uuid = int.uuid();
    let tableSvc = azure.createTableService('avibotarchcontext', 'sYH53B4BkiiAxmts9sZq9UJT+foKwA6P6VxOOjH7Eo28tGcQTm50kDpCs7rgclv3AozMTFuSsAAmRCuAuQ0yQA==');
    let timeS = new Date().toJSON().toString();

    tableSvc.createTableIfNotExists('logs', function(error, result, response){
      if(!error){
        // Table exists or created
      }
    });

    let entGen = azure.TableUtilities.entityGenerator;
    let task = {
      PartitionKey: entGen.String('logs'),
      RowKey: entGen.String(uuid),
      level: entGen.String(level),
      message: entGen.String(message),
      scenary: entGen.String(sce),
      operation: entGen.String(operation),
    };

    tableSvc.insertEntity('logs',task, function (error, result, response) {
      if(!error){
        // Entity inserted
      }
    });

    console.log(`${level}: ${sce}, ${message}, ${operation}, ${timeS}`);
  }
