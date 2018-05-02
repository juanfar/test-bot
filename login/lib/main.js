function myLogin() {

    let usuario = document.getElementById('user').value;
    //let password = btoa(document.getElementById('pass').value);
    let password = document.getElementById('pass').value;
    let alerta = document.getElementById('alerta');
    let myForm = document.getElementById("myForm");

    //console.log(usuario, password);

    $(function() {
        var params = {
          "username": usuario,
          "password": password,
          "type": "lifemiles"
        };
      
        $.ajax({
            url: "https://avapiacceturedesa.azure-api.net/api/auth/v1/login?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Accept-Language","es");
                xhrObj.setRequestHeader("x-channel","BOT");
                xhrObj.setRequestHeader("x-correlation-id","UUID");
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","c3e7baf5ccb1422986d4b1d5ef617f4f");
            },
            type: "POST",
            // Request body
            data: JSON.stringify(params),
        })
        .done(function(data) {
            //alert("success");
            let _token = data.accessToken;
            //console.log(_token);
            //myForm.reset();
            //log.innerHTML = 'usuario logueado';
            saveAzure(_token);
        })
        .fail(function() {
            //alert("error");
            alerta.innerHTML = 'Error de autenticación, datos erroneos';
            alerta.classList.add("alert-danger");
            //myForm.reset();
        });
    });

    function saveAzure(token) {

        var tableUri = 'https://avibotarchcontext.table.core.windows.net';
        var tableService = AzureStorage.Table.createTableServiceWithSas (tableUri, '?sv=2017-07-29&ss=bfqt&srt=sco&sp=rwdlacup&se=2018-05-02T21:44:42Z&st=2018-05-02T13:44:42Z&spr=https&sig=MVMeZy8voIxOHBxSqrI6D1AV7lY8E1djGydq2NXFHx0%3D');


        var insertEntity = {
            PartitionKey: {'_': 'auth'},
            RowKey: {'_': 'access_token'},
            access_token: token
        };
        
        tableService.insertOrReplaceEntity ('botdata', insertEntity, function (error, result, response) {
            if (error) {
                // Insertar error de entidad de tabla
                alerta.classList.add("alert-danger");
                alerta.innerHTML = 'Error en la auteticacón, por favor intente mas tarde';
                //myForm.reset();
            } else {
                // Insertar la entidad de la tabla con éxito
                alerta.classList.add("alert-success");
                alerta.innerHTML = 'Usuario Logueado, por favor introduzca la palabra \'autenticado\' en la conversacion';
                //myForm.reset();
            }
        });
    }

};