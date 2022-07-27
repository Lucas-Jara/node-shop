const generarJWT = require("./generar-jwt");
const googleVerify = require("./google-verify");
const loadFile = require("./load-file");
const coleccionesPermitidas = require('./colecciones-permitidas')


module.exports = {
    generarJWT,
    googleVerify,
    loadFile,
    coleccionesPermitidas
}
