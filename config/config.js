module.exports.config = {
    restEjPostSinBody: {
      data:{
        method: 'POST',
        uri: 'http://httpbin.org/post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: 
          JSON.stringify({
            "firstname": "Nic",
            "lastname": "Raboy"
          }),
        json: true
      },
      auth: {
        type: 'none',
        basicalAuth: {
          key: 'TestAuthBasic',
        },
        jwtAuth: {
          key: '#key#'
        }
      }
    },
    restEjBasichAuth: {
        data:{
          method: 'GET',
          uri: 'http://localhost:5000/',
          headers: {
            'Content-Type': 'application/json',
          },
          json: true
        },
        auth: {
          type: 'basicalAuth',
          basicalAuth: {
            key: 'TestAuthBasic',
          },
          jwtAuth: {
            key: '#key#'
          }
        }
    },
    restGenerarJwt: {
      data:{
        method: 'POST',
        uri: 'https://avapiacceturedesa.azure-api.net/api/auth/v1/v2-auth',
        headers: {
          'Accept-Language': 'es',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Ocp-Apim-Trace': 'true',
          'Ocp-Apim-Subscription-Key': 'c3e7baf5ccb1422986d4b1d5ef617f4f'
        },
        body: 
          {
            "username" : "13460674452",
            "password" : "z1565RbI9g8NxDPv2batbg==",
            "type" : "lifemiles"
          },
        json: true
      },
      auth: {
        type: 'none',
        jwtAuth: {
          key: '',
        }
      }
    }
};

