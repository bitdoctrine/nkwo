import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cases, Store } from '../Store';
import { getError } from '../util';

export default function SinginScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectUrl ? redirectUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const signin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/api/users/signin', {
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
        <title>Log In</title>
      </Helmet>
      <h1 className="my-3 text-primary">Log In</h1>
      <Form onSubmit={signin}>
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
        <div className="mb-3">
          <Button type="submit" variant="primary">
            Log In
          </Button>
        </div>
        <div className="mb-3">
          <h6 className="hint my-3 text-success">
            Got No Account?{' '}
            <Link to={`/signup?redirect=${redirect}`}>Create One Here</Link>
          </h6>{' '}
        </div>
      </Form>
    </Container>
  );
}
