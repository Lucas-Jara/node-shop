const { v4: uuid } = require("uuid");
const path = require("path");

const loadFile = async (files, extvalid, directory) => {
  return new Promise((res, rej) => {
    const { file } = files;

    const extension = path.extname(file.name);

    if (!extvalid.includes(extension)) {
      return rej(`La extension ${extension} no es permitida - ${extvalid}`);
    }

    const tempName = `${uuid()}${extension}`;
    const uploadPath = path.join(__dirname, "../uploads", directory, tempName);

    file.mv(uploadPath, (err) => {
      if (err) {
        rej(err);
      }

      res(tempName);
    });
  });
};

module.exports = loadFile;
