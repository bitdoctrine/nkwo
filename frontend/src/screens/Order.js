import React, { useContext, useEffect } from 'react';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Checkout from '../components/Checkout';
import { Store } from '../Store';

export default function Order() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod, cartItems },
    userInfo,
  } = state;

  useEffect(() => {
    console.log(shippingAddress);
  });
  return (
    <div>
      <Checkout step1 step2 step3 step4></Checkout>
      <Helmet>
        <title>Complete Order</title>
      </Helmet>
      <h1 className="text-primary">Order Preview</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-2 p-2">
            <Card.Title>Shipping Info:</Card.Title>
            <Card.Text>
              <strong>Name:</strong> {shippingAddress.fullName}
              <br />
              <strong>Address</strong> {shippingAddress.address},{' '}
              {shippingAddress.city}, {shippingAddress.postalCode},{' '}
              {shippingAddress.country}
            </Card.Text>
            <Button type="button" variant="primary">
              <Link className="text-light" to="/shipping">
                Edit Shipping Information
              </Link>
            </Button>
          </Card>
          <Card className="mb-2 p-2">
            <Card.Title>Payment</Card.Title>
            <Card.Text>
              <strong>Method:</strong> {paymentMethod}
            </Card.Text>
            <Button type="button" variant="primary">
              <Link className="text-light" to="/payment">
                Edit Payment Method
              </Link>
            </Button>
          </Card>
          <Card className="mb-2">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span></span>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
