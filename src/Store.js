import { createContext, useReducer } from 'react';
export const Store = createContext();

export const cases = {
  ADD: 'ADD_TO_CART',
  REMOVE: 'REMOVE_FROM_CART',
  SIGNIN: 'SIGNIN',
  SIGNOUT: 'SIGNOUT',
  SAVESHIPPINADDRESS: 'SAVESHIPPINADDRESS',
  SAVEPAYMENTMETHOD: 'SAVEPAYMENTMETHOD',
  SIGNUP: 'SIGNUP',
  CLEAR_CART: 'CLEAR_CART',
};

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  cart: {
    shippingAddress: localStorage.getItem('shippingInfo')
      ? JSON.parse(localStorage.getItem('shippingInfo'))
      : {},
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case cases.ADD:
      //add to cart

      const newItem = action.payload;

      const checkItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );

      const cartItems = checkItem
        ? state.cart.cartItems.map((item) =>
            item._id === checkItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      return { ...state, cart: { ...state.cart, cartItems } };

    case cases.REMOVE: {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case cases.CLEAR_CART:
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    case cases.SIGNIN:
      return { ...state, userInfo: action.payload };
    case cases.SIGNOUT:
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
        },
      };
    case cases.SAVESHIPPINADDRESS:
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case cases.SAVEPAYMENTMETHOD:
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };

    default:
      return state;
  }
}

export function StorePrivider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
