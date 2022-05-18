import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Checkout from '../components/Checkout';
import { cases, Store } from '../Store';

function PaymentMethod() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const submit = (e) => {
    e.preventDefault();
    ctxDispatch({ type: cases.SAVEPAYMENTMETHOD, payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/order');
  };
  return (
    <div>
      <Checkout step1 step2 step3></Checkout>
      <Container className="container small-container">
        <Helmet>
          <title>Payment Methods</title>
        </Helmet>
        <h1 className="my-2">Select Payment Method</h1>
        <Form onSubmit={submit}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodName === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodName === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="my-2">
            <Button type="submit" className="btn-primary" variant="primary">
              Go
            </Button>
          </div>
        </Form>
      </Container>
    </div> 
  );
}

export default PaymentMethod;
