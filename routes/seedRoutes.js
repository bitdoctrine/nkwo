import express from 'express';
import Product from '../models/productModel.js';
import data from '../data.js';
import User from '../models/userModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  //for products
  await Product.deleteMany({});
  const createProducts = await Product.insertMany(data.products);

  //for users
  await User.deleteMany({});
  const createUser = await User.insertMany(data.users);
  res.send({ createProducts, createUser });
});

export default seedRouter;
