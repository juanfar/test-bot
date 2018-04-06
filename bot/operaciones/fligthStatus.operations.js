var numF = function (num) {
    return num.slice(3);
}

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

    nDay = parseInt(day, 10);

    if(nDay < 10) {
        nDay = `0${nDay}`;
    }
    
    recogn = `${ano}-${mes}-${nDay}`;
    console.log(recogn);
    
    return recogn;
  }

  module.exports.fecha = fecha;