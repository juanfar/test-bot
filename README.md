# test-bot

App Bot Framework, Node JS y LUIS

## Folders 

Esta es una guia del desarrollo del bot, donde se explica su estructura y funcionamiento.

### Prerequisitos

Instalar de Node.js, npm

```
Node.js y NPM -> https://www.npmjs.com/get-npm?utm_source=house&utm_medium=homepage&utm_campaign=free%20orgs&utm_term=Install%20npm
```

## Estructura del Proyecto
    .
    ├── ...
    ├── bot                     
    │   ├── actions
    |   |     ├── default.js        
    │   |     |── fligthStatus.js   
    |   |     └── greeting.js       
    │   |── msg.json 
    │   └── msg.js              
    │         
    ├── config                  
    │   └── config.js           
    |
    ├── context                 
    │   └── context.js                
    |
    ├── integracion                    
    │   └── int.js               
    |
    ├── logs                    
    │   ├── logConfig.json         
    │   └── logger.js                
    |
    ├── servicios                    
    │   ├── flightStatusByNumber.js
    │   ├── flightStatusByRoute.js
    │   └── servicios.config.json
    |
    |── app.js
    |── config.json
    |── package.json
    └── ...

### Intenciones y Dialogos
Todas las intenciones de Luis, se encuentran en la carpeta `bot/actions`, aqui encontramos los dialogos y la logica de su flujo.
    
### conexiones y APIS
Las conexiones a la API de fligthStatus, se realizan haciendo un llamado desde `bot/actions/fligthStatus.js` y `bot/actions/default.js` en los dialogos que se requiera al modulo de servicios `servicios/flightStatusByNumber.js` y `servicios/flightStatusByRoute.js` segun sea el caso.

### Logs
Para el envio de logs se hace un llamado desde el lugar requerido en los dialogos `bot/actions/fligthStatus.js` y `bot/actions/default.js` al modulo `logs/logger.js` que a su vez hace llamado al modulo de la API de integración `integracion/int.js` para conectar la API.

### Archivos de configuración
En `bot/msg.js` y `bot/msg.json` se encuentran los strings de mensajes que el bot responde al usuario para cada caso.

El archivo `config.json` contiene las configuraciones generales de los modulos.

El archivo `app.js` contiene el la estructura general de la conversación, haciendo un llamado a los dialogos necesarios, tambien se crea el servidor y las conexiones con el mismo y conexiones con azure y LUIS.

