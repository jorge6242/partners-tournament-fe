// local http://localhost:8000

// dev http://tournament.api.com

// QA http://192.168.0.252:9003

var BASE_URL = "http://tournament.api.com";

// Numero de intentos para la excepcion del enpoint.
var attempts = 5;

var TEMPLATE_DESC_TORNEO = ``;

var TEMPLATE_DESC_PREMIACION = ``;

var TEMPLATE_WELCOME = `
<p> Estimado(a) #PARTICIPANTE#</p>
<p>Su solicitud de registro en el Evento #NOMBRETORNEO#&nbsp;ha sido recibida</p>
<p>Le agradecemos hacer click en el siguiente enlace para confirmar su participacion.</p>
<p><a href="#LINKCONFIRMACION#" target="_blank">Confirmacion participacion</a></p>
<p>Luego de eso procederemos a verificar los datos de su pago y recibira&nbsp;una confirmacion de la misma.</p>
<p>Atentamente</p>
<p>Comision Eventos LCC<br>Telefonos<br>Email</p>
`;

var TEMPLATE_CONFIRM = `
<p>Estimado(a) #PARTICIPANTE#</p>
<p>Su solicitud de registro en el Evento #NOMBRETORNEO#&nbsp;ha sido confirmada exitosamente.</p>
<p><span style="letter-spacing: 0.01071em;">Atentamente</span></p>
<p>Comision Eventos LCC<br>Telefonos<br>Email</p>
`;