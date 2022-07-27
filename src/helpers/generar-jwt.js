const jwt = require("jsonwebtoken");

const generarJWT = (uid = "") => {
  return new Promise((res, rej) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          rej("No se puede genearar el token");
        }

        res(token);
      }
    );
  });
};

module.exports = generarJWT;
