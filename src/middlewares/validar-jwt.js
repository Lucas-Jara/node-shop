const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const { connect, disconnect } = require("../database");
const { User } = require("../models");

const validarJWT = async (req = request, res = response, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({
      error: "No hay token en la peticion",
    });
  }

  try {
    await connect()
    const { uid } = jwt.verify(token, process.env.SECRET_KEY);
    
    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json({
        error: "Token no valido - usuario no exite",
      });
    }

    if (!user.status) {
      return res.status(401).json({
        error: "Token no valido - usuario no exite",
      });
    }
    
    req.user = user;
    
    await disconnect()
    next();
    
  } catch (err) {
    await disconnect()
    return res.status(401).json({
      error: "Token no valido",
    });
  }
};

module.exports = validarJWT;
