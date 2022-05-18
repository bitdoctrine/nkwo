import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { cases, Store } from '../Store';
import Checkout from '../components/Checkout';

const ShippingScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submit = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: cases.SAVESHIPPINADDRESS,
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });

    localStorage.setItem(
      'shippingInfo',
      JSON.stringify({ fullName, address, city, postalCode, country })
    );
    navigate('/payment');
  };

  return (
    <div>
      <Helmet>
        <title>Shipping Information</title>
      </Helmet>
      <Checkout step1 step2></Checkout>
      <div className="container small-container">
        <h1 className="my-4">Shipping Information</h1>
        <Form onSubmit={submit}>
          <Form.Group className="mb-2" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              onChange={(e) => setFullName(e.target.value)}
              required
              value={fullName}
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              onChange={(e) => setAddress(e.target.value)}
              required
              value={address}
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              onChange={(e) => setPostalCode(e.target.value)}
              required
              type="number"
              value={postalCode}
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              onChange={(e) => setCountry(e.target.value)}
              required
              value={country}
            />
          </Form.Group>
          <div className="mb-2">
            <Button variant="warning" type="submit">
              Go
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ShippingScreen;
