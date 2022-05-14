import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../util';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAILED':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const navigate = useNavigate();
  const params = useParams();
  const { id: orderId } = params;

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAILED', payload: getError(err) });
      }
    };
    if (!userInfo) {
      return navigate('/signin');
    }
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order, userInfo, orderId, navigate]);

  const {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    orderItems,
  } = order;

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order: {orderId}</title>
      </Helmet>
      <h1 className="my-2">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-2">
            <Card.Body>
              <Card.Title>Shipping Details</Card.Title>
              <Card.Text>
                <strong>Name: </strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                , {order.shippingAddress.country}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-2">
            <Card.Body>
              <Card.Title>Payment Method</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-2">
            <Card.Body>
              <Card.Title>Cart Items</Card.Title>
              <ListGroup variant="flush">
                {orderItems.map((orderItem) => (
                  <ListGroup.Item key={orderItem._id}>
                    <Row className="align-item-center">
                      <Col md={6}>
                        <img
                          src={orderItem.image}
                          alt={orderItem.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/products/${orderItem.slug}`}>
                          {orderItem.name}
                        </Link>
                      </Col>
                      <Col md={3}>
                        <span>{orderItem.quantity}</span>
                      </Col>
                      <Col md={3}>#{orderItem.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-2">
            <Card.Body>
              <Card.Title>Summary</Card.Title>
              <ListGroup variant="flash">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>#{itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>#{shippingPrice.toFixed(2)}</Col>
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
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
