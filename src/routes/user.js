const { Router } = require("express");
const { check } = require("express-validator");
const { getAllUsers, createUser, checkJWT } = require("../controllers/user");
const validarCampos = require("../middlewares/validar-campos");

const router = Router();

router.get("/", getAllUsers);

router.post("/",[
    check("name", "El nombre es obligatorio").not().isEmpty().trim().isLength({min: 5}),
    check("email", "El email es obligatorio").not().isEmpty().isEmail(),
    check("password", "La contrasenia es obligatoria").not().isEmpty().trim().isLength({min: 6}),
    validarCampos
  ], createUser);

  router.get('/validate-jwt', checkJWT)

module.exports = router;
