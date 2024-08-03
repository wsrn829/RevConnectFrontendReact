import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';

const HomePage = () => {
  return (
    <div>
      <Container className="mt-5 text-left">
        <Row className="justify-content-left">
          <Col md={8} lg={6}>
            <h1 className="display-4 mb-3 no-wrap">RevConnect: Your Social Hub</h1>
            {/* <h2 className="lead mb-4 mt-3" style={{fontSize: '28px'}}>Discover. Connect. Engage.</h2> */}
          </Col>
        </Row>
        <br />
        <Row>
          <div className="cta-section section-padding mt-4">
            <div className="container center">
              <div className="cta-wrapper">
                <div className="subheader black">Are you ready?</div>
                <h2 className="cta-h2 center">Connect with friends, share your experiences, and chat in real-time!</h2>
                <Link to="/register" className="button join">Get started</Link>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default HomePage;
