import './App.css';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
// import data from './data';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { Badge, Dropdown, Nav, NavDropdown } from 'react-bootstrap';
import { useContext } from 'react';
import { cases, Store } from './Store';
import CartScreen from './screens/CartScreen';
import SinginScreen from './screens/SinginScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { cart, userInfo } = state;

  const signout = () => {
    ctxDispatch({ type: cases.SIGNOUT });
    localStorage.removeItem('userInfo');
  };
  return (
    <Router>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>nkwo</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link to="/cart" className="nav-link">
                  <i class="fa-solid fa-basket-shopping"></i>
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="warning">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <Dropdown.Divider />
                    <LinkContainer to="/orderHistory">
                      <NavDropdown.Item>Previous Orders</NavDropdown.Item>
                    </LinkContainer>
                    <Dropdown.Divider />
                    <Link
                      to="#signout"
                      className="dropdown-item"
                      onClick={signout}
                    >
                      Logout
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link to="/signin" className="nav-link">
                    Login
                  </Link>
                )}
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/" element={<HomeScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SinginScreen />} />
            </Routes>
          </Container>
        </main>
        <footer className="text-center">bitdoctrine Inc.</footer>
      </div>
    </Router>
  );
}

export default App;
