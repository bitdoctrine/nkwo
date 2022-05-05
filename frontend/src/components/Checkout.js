import React from 'react';
import { Col, Row } from 'react-bootstrap';

export default function Checkout(props) {
  return (
    <div>
      <Row className="checkout">
        <Col className={props.step1 ? 'active' : 'invactive'}>Login</Col>
        <Col className={props.step2 ? 'active' : 'invactive'}>Shipping</Col>
        <Col className={props.step3 ? 'active' : 'invactive'}>Payment</Col>
        <Col className={props.step4 ? 'active' : 'invactive'}>
          Complete Order
        </Col>
      </Row>
    </div>
  );
}
