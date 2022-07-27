const { request, response } = require("express");

const isAdminRole = (req = request, res = response, next) => {
  const { user } = req;

  console.log(user);

  if (user.role !== "admin") {
    return res.status(401).json({
      error: "No tienens rol",
    });
  }

  next();
};



module.exports = isAdminRole