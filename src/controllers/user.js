const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { connect, disconnect } = require("../database");
const { response, request } = require("express");
const { isValidToken } = require("../utils");
const generarJWT = require("../helpers/generar-jwt");

const getAllUsers = async (req, res) => {
  await connect();
  const users = await User.find();

  res.json({ users });
  await disconnect();
};

const createUser = async (req = request, res = response) => {
  await connect();
  const { name, email, password } = req.body;
  try {
    const userInDB = await User.findOne({ email });

    if (userInDB) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json(user);
    await disconnect();
  } catch (err) {
    await disconnect();
    res.status(500).json({
      error: err.message,
    });
  }
};

const checkJWT = async (req = request, res = response) => {
  const { token } = req.headers;

  let userId = "";

  try {
    userId = await isValidToken(token);
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }

  await connect();
  const user = User.findById(userId)
  await disconnect();

  console.log("user",user);

  if (!user) {
    return res.status(400).json({
      error: `No exite usuario con id ${userId}`,
    });
  }

  const { _id, email, role, name } = user;


  return res.status(200).json({
    user: {
      email,
      role,
      name,
    },
  });
};

module.exports = {
  getAllUsers,
  createUser,
  checkJWT,
};
