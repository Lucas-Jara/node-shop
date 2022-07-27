const { Router } = require("express");
const { check } = require("express-validator");
const {
  getAllProduct,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");
const {validarCampos,validarJWT, isAdminRole} = require("../middlewares");

const router = Router();


router.get("/", getAllProduct);

router.get("/:_id",[
  check("_id", "The id must be a valid mongo id").not().isEmpty().isMongoId(),
  validarCampos
], getProductById);

router.post("/", [
  validarJWT,
  check("name", "El nombre es obligatorio").not().isEmpty().isLength({min: 5}),
  check("price", "El precio es obligatorio").not().isEmpty(),
  check("description", "La descripcion es obligatoria").not().isEmpty(),
  check("category", `La categoria es obligatoria`).not().isEmpty(),
  validarCampos
],createProduct);

router.put("/:_id",[
  check("_id", "The id must be a valid mongo id").not().isEmpty().isMongoId(),
  validarCampos
], updateProduct);

router.delete("/:_id",[
  validarJWT,
  isAdminRole,
  check("_id", "The id must be a valid mongo id").not().isEmpty().isMongoId(),
  validarCampos
], deleteProduct);




module.exports = router;
