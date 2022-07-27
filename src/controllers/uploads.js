const path = require("path");
const fs = require("fs");

const { request, response } = require("express");
const { connect, disconnect } = require("../database");
const { loadFile } = require("../helpers");
const { Product, User } = require("../models");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const uploadFile = async (req = request, res = response) => {
  try {
    const extensionValid = [".png", ".jpg", ".jpeg", ".gif"];

    const fileName = await loadFile(req.files, extensionValid, "imgs");
    res.status(201).json({
      fileName,
    });
  } catch (err) {
    return res.status(400).json({
      error: "No se pudo subir el archivo",
    });
  }
};

const updateFile = async (req = request, res = response) => {
  try {
    await connect();
    const { collection, _id } = req.params;

    let model;

    switch (collection) {
      case "user":
        model = await User.findById(_id);
        if (!model) {
          return res.status(400).json({
            error: `No exite un usuario con id: ${_id}`,
          });
        }
        break;
      case "product":
        model = await Product.findById(_id);
        if (!model) {
          return res.status(400).json({
            error: `No exite un producto con id: ${_id}`,
          });
        }
        break;

      default:
        return res.status(500).json({
          error: "Se me olvidó validar esto",
        });
    }

    if (model.image) {
      const imagePath = path.join(
        __dirname,
        "../uploads",
        collection,
        model.image
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const extensionValid = [".png", ".jpg", ".jpeg", ".gif"];

    const fileName = await loadFile(req.files, extensionValid, collection);
    model.image = fileName;

    await model.save();

    res.status(200).json({
      model,
    });
    await disconnect();
  } catch (err) {
    await disconnect();
    console.log(err);
    return res.status(400).json({
      error: "No se pudo actualizar la imagen",
    });
  }
};

const cloudinaryUpdateFile = async (req = request, res = response) => {
  try {
    await connect();
    const { collection, _id } = req.params;

    let model;

    switch (collection) {
      case "user":
        model = await User.findById(_id);
        if (!model) {
          return res.status(400).json({
            error: `No exite un usuario con id: ${_id}`,
          });
        }
        break;
      case "product":
        model = await Product.findById(_id);
        if (!model) {
          return res.status(400).json({
            error: `No exite un producto con id: ${_id}`,
          });
        }
        break;

      default:
        return res.status(500).json({
          error: "Se me olvidó validar esto",
        });
    }
    if (model.image) {
      const nombreArr = model.image.split("/");
      const nombre = nombreArr[nombreArr.length - 1];
      const [public_id] = nombre.split(".");
      cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    model.image = secure_url;

    await model.save();

    res.status(200).json({
      model,
    });

    await disconnect();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "No se pudo actualizar la imagen",
    });
  }
};

const showFile = async (req = request, res = response) => {
  try {
    await connect()
    const { collection, _id } = req.params;

    let model;

    switch (collection) {
      case "user":
        model = await User.findById(_id);
        if (!model) {
          return res.status(400).json({
            error: `No exite un usuario con id: ${_id}`,
          });
        }
        break;
      case "product":
        model = await Product.findById(_id);
        if (!model) {
          return res.status(400).json({
            error: `No exite un producto con id: ${_id}`,
          });
        }
        break;

      default:
        return res.status(500).json({
          error: "Se me olvidó validar esto",
        });
    }

    if (model.image) {
      const imagePath = path.join(
        __dirname,
        "../uploads",
        collection,
        model.image
      );
      if (fs.existsSync(imagePath)) {
        return res.status(200).sendFile(imagePath);
      }
    }

    const imagePath = path.join(__dirname, "../assets/no-image.jpg");

    await disconnect()
    return res.status(200).sendFile(imagePath);
    
  } catch (err) {
    await disconnect()
    console.log(err);
    return res.status(400).json({
      error: "No se pudo mostrar la imagen",
    });
  }
};

module.exports = {
  uploadFile,
  updateFile,
  cloudinaryUpdateFile,
  showFile
};
