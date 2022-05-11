import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Checkout from '../components/Checkout';
import LoadingBox from '../components/LoadingBox';
import { cases, Store } from '../Store';
import { getError } from '../util';

const localCases = {
  CREATE: 'CREATE_REQUEST',
  CREATE_SUCCESS: 'CREATE_SUCCES',
  CREATE_FAILED: 'CREATE_FAILED',
};

const reducer = (state, action) => {
  switch (action.type) {
    case localCases.CREATE:
      return { ...state, loading: true };
    case localCases.CREATE_SUCCESS:
      return { ...state, loading: false };

    case localCases.CREATE_FAILED:
      return { ...state, loading: false };

    default:
      return state;
  }
};

export default function Order() {
  const navigate = useNavigate();

  const [{ loading, error }, dispatch] = useReducer(
    (reducer, { loading: false, error: '' })
  );

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const {
    cartItems,
    ShippingPrice,
    taxPrice,
    ItemsPrice,
    totalPrice,
    paymentMethod,
    shippingAddress,
  } = cart;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.ItemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );

  cart.ShippingPrice = cart.ItemsPrice < 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.05 * ItemsPrice);
  cart.totalPrice = ItemsPrice + ShippingPrice + taxPrice;

  //Place Order
  const placeOrder = async (e) => {
    try {
      dispatch({ type: localCases.CREATE });

      const { data } = await axios.post(
        '/api/order',
        {
          orderItems: cartItems,
          shippingAddress: shippingAddress,
          paymentMethod: paymentMethod,
          ItemsPrice: ItemsPrice,
          ShippingPrice: ShippingPrice,
          taxPrice: taxPrice,
          totalPrice: totalPrice,
        },
        {
          headers: {
            authorization: `Bearer${userInfo.token}`,
          },
        }
      );

      ctxDispatch({ type: cases.CLEAR_CART });
      dispatch({ type: localCases.CREATE_SUCCESS });
      localStorage.removeItem('cartItems');
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      dispatch({ type: localCases.CREATE_FAILED });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!paymentMethod) {
      navigate('/shipping');
    }
  }, [paymentMethod, navigate]);

  return (
    <div>
      <Helmet>
        <title>Order</title>
      </Helmet>
      <Checkout step1 step2 step3 step4></Checkout>
      <h1 className="my-1 text-primary">Order Preview</h1>
      <Row>
        <Col md={8}>
          <Card className="my-4">
            <Card.Body>
              <Card.Title>Shipping Info:</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Address:</strong> {cart.shippingAddress.address},{' '}
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </Card.Text>
              <Button variant="primary" className="text-center">
                <Link to="/shipping" className="text-light">
                  Edit Information
                </Link>
              </Button>
            </Card.Body>
          </Card>
          <Card className="my-4">
            <Card.Body>
              <Card.Title>Payment Info:</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {cart.paymentMethod}
              </Card.Text>
              <Button variant="primary">
                <Link to="/payment" className="text-light">
                  Edit Information
                </Link>
              </Button>
            </Card.Body>
          </Card>
          <Card className="my-4">
            <Card.Body>
              <Card.Title>Cart Items</Card.Title>
              <ListGroup>
                {cartItems.map((item) => (
                  <ListGroup.Item className="my-3">
                    <Row className="align-items-center">
                      <Col md={6} className="my-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        />
                        <Button variant="outline-primary">
                          <Link
                            className="text-primary small "
                            to={`/product/${item.slug}`}
                          >
                            {item.name}
                          </Link>
                        </Button>
                      </Col>
                      <Col md={3} className="my-2">
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3} className="my-2">
                        <span>{`#${item.price}`}</span>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button variant="primary">
                <Link to="/cart" className="text-light">
                  Edit Cart
                </Link>
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Summary</Card.Title>
              <ListGroup>
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>#{ItemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>#{ShippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>#{taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>#{totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrder}
                      disabled={cartItems.length === 0}
                    >
                      Order
                    </Button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
