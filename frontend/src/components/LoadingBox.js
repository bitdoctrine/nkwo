import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

export default function LoadingBox(props) {
  const { variant, animation } = props;
  return (
    <Spinner
      animation={animation || 'grow'}
      role="status"
      variant={variant || 'warning'}
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}
