import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cases, Store } from '../Store';
import { getError } from '../util';

export default function Signup() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectUrl ? redirectUrl : '/';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const signin = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do no match');
      return;
    }

    try {
      const { data } = await axios.post('/api/users/signup', {
        fullName,
        email,
        password,
      });
      ctxDispatch({ type: cases.SIGNIN, payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <Container className="small-container">
      <Helmet>
        <title>Register</title>
      </Helmet>
      <h1 className="my-3 text-primary">Register</h1>
      <Form onSubmit={signin}>
        <Form.Group className="mb-3" controlId="fullName">
          <Form.Label className="text-primary">Full Name</Form.Label>
          <Form.Control
            type="name"
            required
            onChange={(e) => setFullName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label className="text-primary">Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label className="text-primary">Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label className="text-primary">Confirm Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" variant="primary">
            Go
          </Button>
        </div>
        <div className="mb-3">
          <h6 className="hint my-3 text-dark">
            Got An Account?{' '}
            <Link to={`/signin?redirect=${redirect}`}>Login</Link>
          </h6>{' '}
        </div>
      </Form>
    </Container>
  );
}
