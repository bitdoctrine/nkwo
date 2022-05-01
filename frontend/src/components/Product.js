import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { cases, Store } from '../Store';
import axios from 'axios';

export default function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCart = async (item) => {
    const checkItem = cartItems.find((x) => x._id === product._id);
    const quantity = checkItem ? checkItem.quantity + 1 : 1;
    const { data } = await axios.get(`api/products/${item._id}`);

    if (data.countInStock < quantity) {
      window.alert('Sorry, Out of stock');
      return;
    }

    ctxDispatch({
      type: cases.ADD,
      payload: { ...item, quantity },
    });
  };

  return (
    <Card className="product">
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>
          <p>{product.price}</p>
        </Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="danger" disabled>
            Unavailable
          </Button>
        ) : (
          <Button variant="outline-primary" onClick={() => updateCart(product)}>
            Add to cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
