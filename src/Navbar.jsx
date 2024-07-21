import React from 'react';
import { Container, Navbar as BootstrapNavbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';

const Navbar = () => {
  return (
    <div>
      <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="navbar">
        <Container className='mt-4'>
          <BootstrapNavbar.Brand
            as={Link}
            to="/"
            style={{ fontSize: '40px', color: '#39cccc', fontWeight: 'bold', lineHeight: '1.8', fontFamily: 'Lora' }}
          >
            REVCONNECT
          </BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" style={{ color: '#f7ede2', fontWeight: 'bold', fontFamily: 'Arial', fontSize: '25px' }}>HOME</Nav.Link>
              <Nav.Link as={Link} to="/profile" style={{ color: '#f7ede2', fontWeight: 'bold', fontFamily: 'Arial', fontSize: '25px' }}>PROFILE</Nav.Link>
              <Nav.Link as={Link} to="/posts" style={{ color: '#f7ede2', fontWeight: 'bold', fontFamily: 'Arial', fontSize: '25px' }}>POSTS</Nav.Link>
              <Nav.Link as={Link} to="/follows" style={{ color: '#f7ede2', fontWeight: 'bold', fontFamily: 'Arial', fontSize: '25px' }}>FOLLOWS</Nav.Link>
              <Nav.Link as={Link} to="/chatroom" style={{ color: '#f7ede2', fontWeight: 'bold', fontFamily: 'Arial', fontSize: '25px' }}>CHATROOM</Nav.Link>
            </Nav>
            <div className="d-flex ms-auto">
              <Button
                variant="outline-light"
                as={Link}
                to="/register"
                className="me-2 custom-button-1" style={{ color: 'white', fontWeight: 'bold', fontFamily: 'Arial', fontSize: '25px' }}
              >
                REGISTER
              </Button>
              <Button
                variant="outline-light"
                as={Link}
                to="/login"
                className="custom-button-2" style={{ color: 'white', fontWeight: 'bold', fontFamily: 'Arial', fontSize: '25px' }}
              >
                LOGIN
              </Button>
            </div>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
    </div>
  );
}

export default Navbar;
