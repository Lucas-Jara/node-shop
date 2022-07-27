const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const { User } = require("../models");
const { generarJWT, googleVerify } = require("../helpers");
const { connect, disconnect } = require("../database");

const login = async (req = request, res = response) => {
  try {
    await connect();

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const validarPassword = bcryptjs.compareSync(password, user.password);

    if (!user | !user.status | !validarPassword) {
      await disconnect();
      return res.status(401).json({
        error: "Usuario / Password no son validos",
      });
    }

    const token = await generarJWT(user._id);

    res.status(200).json({
      user,
      token,
    });

    await disconnect();
  } catch (error) {
    await disconnect();
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const googleSignIn = async (req = request, res = response) => {
  try {
    await connect();
    const { idToken } = req.body;
    const { email, name, image } = await googleVerify(idToken);

    const user = await User.findOne({ email });

    if (!user) {
      const newUser = await User({
        name,
        email,
        password: "@",
        image,
        google: true,
      });

      await newUser.save();
    }

    if (!user.status) {
      await disconnect();
      return res.status(401).json({
        error: "Hable con un administrador, usuario bloqueado",
      });
    }

    const token = await generarJWT(user._id);

    res.status(201).json({
      user,
      token,
    });
    await disconnect();
  } catch (err) {
    await disconnect();
    return res.status(401).json({
      error: err,
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
