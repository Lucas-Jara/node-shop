const jwt = require("jsonwebtoken");

const capitalize = (str) => {
  const words = str.split(" ");
  const capitalizedWords = words.map((word) => {
    return word[0].toUpperCase() + word.slice(1);
  });

  return capitalizedWords.join(" ");
};

const slugify = (str) => {
  const words = str.split(" ");
  const sluggedWords = words.map((word) => {
    return word.toLowerCase().replace(/ /g, "_");
  });

  return sluggedWords.join("_");
};

const isValidToken = (token = "") => {
  if (token.length <= 10) {
    return Promise.reject("JWT no es valido");
  }

  return new Promise((res, rej) => {
    try {
      jwt.verify(token, process.env.SECRET_KEY || "", (err, payload) => {
        if (err) return rej("JWT no es valido");
        const { _id } = payload;

        console.log(_id);
        res(_id);
      });
    } catch (err) {
      rej("JWT no es valido");
    }
  });
};

module.exports = {
  capitalize,
  slugify,
  isValidToken,
};
