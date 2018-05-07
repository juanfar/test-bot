![alt text](https://www.avianca.com/etc/designs/avianca/images/logo-avianca.png)

# Achitecture

Guia de uso de componentes del botframework

## Crear Proyecto Bot Framework

Crear un Bot con [Bot Framework](https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-quickstart)

## Componentes 
    .
    ├── ...
    ├── bot                     
    │   └── actions
    │         
    ├── context                  
    |
    ├── integración                 
    |
    ├── login                    
    |
    ├── logs                    
    |   
    ├── servicios                    
    └── ...

### Agregar dialogo de intención

Para agregar un dialogo de intención se debe crear un archivo con el nombre de la intención y con extensión `.js` en la carpeta de actions. En este módulo se debe importar el builder de Bot Framework `var builder = require('botbuilder')`. Adicionalmente exportar el modulo que contiene un array con las funciones necesarias para la logica del flujo. Ejemplo:

`greetings.js`

```
var builder = require('botbuilder')


module.exports = [

    (session, args) => {
        session.send('Hola en que puedo ayudarte');
    }

]
```

Ahora, en `app.js` se debe importar el módulo `greetings.js` y crear un dialogo al que correspondera la lógica de este módulo. Ejemplo: 

```
var greet = require('./bot/actions/greeting.js');


bot.dialog('GreetingDialog', greet).triggerAction({
    matches: 'Greeting',
    intentThreshold: 0.9
})

]

```

### Módulo de integración

El módulo de integración `integracion/int.js`, permite hacer la conexión con las APIs externas que seran usadas por el bot, se debe exportar una función en la que como parametro deben entrar las opciones del request de la API. Ejemplo:

```
const _openId = function (url, options) { // request a la API de logs

    const fetch = require('node-fetch');
    
    return fetch(url, options);
}
```

### Módulo de Autenticación

El módulo de Autenticación `login/index.html`, contiene un formulario html que obtiene los datos 'usuario' y 'password', estos datos son enviados como parametro al servicio de login de Avianca, el cual devuelve un token, que posteriormente sera incluido como parametro del body para hacer post a Azure Storage y asi almacenar el token en la tabla `botdata`, si la autenticación es exitosa la web respondera que se debe escribir la palabra 'autenticado' para que el bot haga la consulta de lifemiles.

### Logs

modulo: `logs/logger.js`


Ejemplo de request:

```
var int = require('../integracion/int.js'); // importación al modulo de integración
var config = require('../config.json');

logger.info = function(level, message, operation) {
    
    let timeS = new Date().toJSON().toString();

    let headers = {
      "x-correlation-id": "",
      "x-channel": "",
      "Ocp-Apim-Trace" : "",
      "Ocp-Apim-Subscription-Key": ""
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

    // envio parametros al modulo de integracion
    let sendInfo = int.sendLogInfo(options);

    sendInfo.then(function(result) {

      }, function(err) {
          console.log('ERR', err);
      })

  }

  ```

ejemplo de uso en `bot/actions/<myIntent>.js`

 ```
var logger = require('../../logs/logger.js');


logger.info('info', 'iniciando dialogo', 'flightStatus');

 ```

### Servicios

Para crear un servicio, se debe crear un archivo con el nombre del servicio con extension `.js`, y allí hacer la conexión y request de las APIS necesarias.
