import axios from 'axios';
import React, { useContext } from 'react';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import MessageBox from '../components/MessageBox';
import { cases, Store } from '../Store';

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  //update Cart
  const updateCart = async (item, quantity) => {
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

  //Remove from cart

  const removeItem = (item) => {
    ctxDispatch({ type: cases.REMOVE, payload: item });
  };

  //Checkout
  const checkout = () => {
    navigate('/signin?redirect=/shipping');
  };
  return (
    <div>
      <Helmet>
        <title>Shopping cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Lonely in here <Link to="/">Buy a thing or two</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <Link to={`/product/${item.slug}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        />
                      </Link>{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant="light"
                        disabled={item.quantity === 1}
                        onClick={() => updateCart(item, item.quantity - 1)}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        disabled={item.countInStock === 0}
                        onClick={() => updateCart(item, item.quantity + 1)}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}>{`#${item.price}`}</Col>
                    <Col md={2}>
                      <Button variant="light" onClick={() => removeItem(item)}>
                        <i class="fa-solid fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flash">
                <ListGroup.Item>
                  <h3>
                    <Row>
                      <Col md={5}>
                        Items: {cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Col>{' '}
                      <Col md={7}>
                        {' '}
                        Total : #
                        {cartItems.reduce(
                          (a, c) => a + c.price * c.quantity,
                          0
                        )}
                      </Col>
                    </Row>
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="warning"
                      disabled={cartItems.length === 0}
                      onClick={() => checkout()}
                    >
                      Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
