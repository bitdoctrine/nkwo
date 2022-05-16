import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { cases, Store } from '../Store';
import { getError } from '../util';

const reducer = (action, state) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, updating: true };
    case 'UPDATE_SUCCESS':
      return { ...state, updating: false };
    case 'UPDATE_FAILED':
      return { ...state, updating: false };
    default:
      return state;
  }
};
export default function UserProfile() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [{ updating }, dispatch] = useReducer(reducer, { updating: false });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/users/profile`,
        {
          name,
          email,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      ctxDispatch({ type: cases.SIGNIN, payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Profile Successfully Updated');
    } catch (error) {
      dispatch({
        type: 'UPDATE_FAILED',
      });
      toast.error(getError(error));
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>{userInfo.name}</title>
      </Helmet>
      <h1 className="my-2">{userInfo.name}</h1>
      <form onSubmit={submit}>
        <Form.Group className="mb-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>
        <div className="my-2">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
