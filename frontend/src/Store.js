import { createContext, useReducer } from 'react';
export const Store = createContext();

export const cases = {
  ADD: 'ADD_TO_CART',
  REMOVE: 'REMOVE_FROM_CART',
};

const initialState = {
  cart: {
    cartItems: [],
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

      return { ...state, cart: { ...state.cart, cartItems } };
    default:
      return state;
  }
}

export function StorePrivider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
