const validarCampos = require("./validar-campos");
const validarJWT = require("./validar-jwt");
const isAdminRole = require("./is-admin-role");
const validarArchivo = require("./validar-archivo");

module.exports = {
  validarCampos,
  validarJWT,
  isAdminRole,
  validarArchivo
};
