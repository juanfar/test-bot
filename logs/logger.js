'use strict'

var azure = require('azure-storage');
var int = require('../integracion/int.js');
var config = require('../config.json');

var myObject = '';

var logger = exports;

  logger.info = function(level, message, operation) {
    
    let timeS = new Date().toJSON().toString();
    let url = config.logs.url;

    let headers = {
      "x-correlation-id": "UUID",
      "x-channel": "BOT",
      "Ocp-Apim-Trace" : true,
      "Ocp-Apim-Subscription-Key": "c3e7baf5ccb1422986d4b1d5ef617f4f"
    }

    let body = {
      "timestamp": timeS,
      "level": level,
      "message": message,
      "operation": operation
    }

    let sendInfo = int.logInfo(url, headers, body);

    sendInfo.then(function(result) {

      }, function(err) {
          console.log('ERR', err);
      })

  }

  logger.debug = function(level, message, sce, operation) {

    let timeS = new Date().toJSON().toString();
    let tableSvc = azure.createTableService('avibotarchcontext', 'sYH53B4BkiiAxmts9sZq9UJT+foKwA6P6VxOOjH7Eo28tGcQTm50kDpCs7rgclv3AozMTFuSsAAmRCuAuQ0yQA==');

    tableSvc.createTableIfNotExists('logs', function(error, result, response){
      if(!error){
        // Table exists or created
      }
    });

    let entGen = azure.TableUtilities.entityGenerator;
    let task = {
      PartitionKey: entGen.String('hometasks'),
      RowKey: entGen.String('1'),
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

    console.log(`${level}: ${message}, ${sce}, ${operation}, ${timeS}`);
  }
