const { Router } = require("express");
const { check } = require("express-validator");
const { validarArchivo, validarCampos } = require("../middlewares");
const { uploadFile, updateFile, cloudinaryUpdateFile, showFile } = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers");

const router = Router();

// router.post("/", validarArchivo, uploadFile);

// router.put('/:collection/:_id', [
//     validarArchivo,
//     check("_id", "El id debe de ser de mongo").isMongoId(),
//     check('collection').custom( c => coleccionesPermitidas( c, ['user','product'] ) ),
//     validarCampos
// ], updateFile)

router.put('/:collection/:_id', [
    validarArchivo,
    check('_id','El id debe de ser de mongo').isMongoId(),
    check('collection').custom( c => coleccionesPermitidas( c, ['user','product'] ) ),
    validarCampos
], cloudinaryUpdateFile )

// router.get('/:collection/:_id', [
//     check('_id','El id debe de ser de mongo').isMongoId(),
//     check('collection').custom( c => coleccionesPermitidas( c, ['user','product'] ) ),
//     validarCampos
// ], showFile )

module.exports = router;
