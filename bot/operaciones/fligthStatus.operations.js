'use strict'

var fecha = function(entra) {
    let recogn = '';
    let mes;
    let inputs = entra.split(" ");
    let mth = inputs.slice(0,1);
    let day = inputs.slice(1);
    let year = new Date();
    let ano = year.getFullYear();
    
    console.log(ano);

    let month = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    for (let i = 0; i < month.length; i++) {
        if (month[i].toLowerCase() == mth.toString().toLowerCase()) {
          mes = i+1;
          if(mes < 10) {
            mes = `0${i+1}`;
          }
        }
    }

    let nDay = parseInt(day, 10);

    if(nDay < 10) {
        nDay = `0${nDay}`;
    }
    
    recogn = `${ano}-${mes}-${nDay}`;
    console.log(recogn);
    
    return recogn;
  }

  module.exports.fecha = fecha;

  let validarPatron = function (str) {

    let res;
    let numeros = /(\d+)/;

    let rutas = [
      /de (\w+) para (\w+)/,
        /de (\w+) hasta (\w+)/,
        /de (\w+) a (\w+)/,
        /desde (\w+) hasta (\w+)/,
        /desde (\w+) para (\w+)/,
        /desde (\w+) a (\w+)/,
        /(\w+) hasta (\w+)/,
        /(\w+) para (\w+)/,
        /(\w+) a (\w+)/
    ];

   for (let i=0; i < rutas.length; i++) {
        if(rutas[i].test(str) == true) {
            let routeMatch = str.match(rutas[i]);
            /* console.log(rutas[i], ' -> ', rutas[i].test(str));
            console.log(routeMatch[1], routeMatch[2]);*/
            console.log(routeMatch);

            res = ciudades(routeMatch[1], routeMatch[2]);

            return res;
        }
    }

        if(numeros.test(str) == true) {
            let numMatch = str.match(numeros);
            /* console.log(numeros, ' -> ', numeros.test(str));
            console.log(numMatch); */

            res = numMatch

            return res;
        }

  }

  let ciudades = function (match1, match2) {

    const ciudades = require('../listas/ciudades.json');
    let cFrom = '';
    let cTo = '';
    let code = {};
  
    let el1 = match1;
    let el2 = match2;

    for (let i=0; i < ciudades.subLists.length; i++) {
        for (let j=0; j < ciudades.subLists[i].list.length; j++) {
            if (el1 == ciudades.subLists[i].list[j]) {
                cFrom = ciudades.subLists[i].canonicalForm.trim();
            }
        }
    }
    
    for (let i=0; i < ciudades.subLists.length; i++) {
        for (let j=0; j < ciudades.subLists[i].list.length; j++) {
            if (el2 == ciudades.subLists[i].list[j]) {
                cTo = ciudades.subLists[i].canonicalForm.trim();
            }
        }
    }

    return code = {
        cfrom: cFrom,
        cto: cTo
    };
    
  }


  module.exports.validarPatron = validarPatron;