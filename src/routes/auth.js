const {Router} = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const {validarCampos} = require('../middlewares')

const router = Router();


router.post('/',[
    check("email", "El email es obligatorio").isEmail(),
    check("password", "La contrasenia es obligatoria").not().isEmpty().isLength({min:6}),
    validarCampos
] ,login)

router.post('/google',[
    check('idToken', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignIn );

module.exports = router;