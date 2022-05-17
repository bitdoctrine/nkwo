import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoute.js';

dotenv.config();

//DATABASE CONNECTION

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log('Database Connection Successfull');
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get('/', (req, res) => {
  res.send('Express says Hello?');
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.use('/api/seeds', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../frontend/build'));
}
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server is up and running at ${port}`);
});
