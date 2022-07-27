const { connect, disconnect } = require("../database");
const { Product } = require("../models");
const { response, request } = require("express");
const { capitalize, slugify } = require("../utils");

const getAllProduct = async (req = request, res = response) => {
  await connect();

  const { limit = 5, desde = 0 } = req.query;

  const query = { status: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate("user", "name email")
      .skip(Number(desde))
      .limit(Number(limit))
  ]);
  await disconnect();

  res.status(201).json({
    total,
    products,
  });

  try {
  } catch (err) {
    console.log(err);
    await disconnect();
    return res.status(401).json({
      err,
    });
  }
};

const createProduct = async (req = request, res = response) => {
  try {
    await connect();

    const { user } = req;

    console.log(user);

    const { name, price, description, image, category } = req.body;
    const productInDb = await Product.findOne({ name });

    if (productInDb) {
      return res.status(400).json({
        error: "Product already exists",
      });
    }

    const product = new Product({
      user: user._id,
      name,
      price,
      description,
      image,
      category,
      slug: name.toLowerCase().replace(/ /g, "_"),
    });

    await product.save();

    res.json(product);
    await disconnect();
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const getProductById = async (req = request, res = response) => {
  try {
    await connect();
    const { _id } = req.params;
    const productInDb = await Product.findOne({ _id });
    await disconnect();

    if (!productInDb) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    return res.json({ productInDb });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const updateProduct = async (req = request, res = response) => {
  try {
    await connect();
    const { _id } = req.params;

    const productInDb = await Product.findOne({ _id });

    if (!productInDb) {
      await disconnect();

      return res.status(404).json({
        error: "Product not found",
      });
    }

    const { name, price, description, image, category } = req.body;

    const product = {
      name: capitalize(name),
      price,
      description,
      image,
      category,
      slug: slugify(name),
    };

    const newProduct = await Product.findOneAndUpdate({ _id }, product, {
      new: true,
    });

    await disconnect();

    return res.json({
      message: "Product updated successfully",
      product: newProduct,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const deleteProduct = async (req = request, res = response) => {
  try {
    await connect();
    const { _id } = req.params;

    const productInDb = await Product.findOne({ _id });

    if (!productInDb) {
      await disconnect();

      return res.status(404).json({
        error: "Product not found",
      });
    }

    const productDeleted = await Product.findByIdAndUpdate(
      _id,
      { status: false },
      { new: true }
    );

    res.json(productDeleted);

    return res.json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  getAllProduct,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
