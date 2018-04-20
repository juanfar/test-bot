alert('hola');

function Login() {

    var done=0; 
    var usuario=document.login.usuario.value; 
    var password=document.login.password.value;
    
    if (usuario=="USUARIO1" && password=="CONTRASEÑA1") { 
        window.location="http://www.google.com";
    } 
    if (usuario=="USUARIO2" && password=="CONTRASEÑA2") { 
        window.location="http://www.yahoo.com";
    } 
    if (usuario=="" && password=="") { 
        window.location="http://www.facebook.com"; 
    }

    console.log(password);
    console.log(usuario);
};