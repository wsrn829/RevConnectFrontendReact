import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, ListGroup, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const FollowsList = () => {
  const { userID } = useParams();
  const [follows, setFollows] = useState([]);
  const [view, setView] = useState('followers');

  useEffect(() => {
    const fetchFollows = async () => {
      try {
        const response = await fetch(`/follows/${view}/${userID}`);
        if (response.ok) {
          const data = await response.json();
          setFollows(data);
        } else {
          console.error('Error fetching follows:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching follows:', error);
      }
    };

    fetchFollows();
  }, [userID, view]);

  const handleToggle = (value) => {
    setView(value);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center mb-3">
        <ToggleButtonGroup type="radio" name="viewOptions" defaultValue="followers" onChange={handleToggle}>
          <ToggleButton id="tbg-radio-1" value={'followers'} variant="outline-info">
            Followers
          </ToggleButton>
          <ToggleButton id="tbg-radio-2" value={'following'} variant="outline-info">
            Following
          </ToggleButton>
        </ToggleButtonGroup>
      </Row>
      <Row className="justify-content-center">
        <Col md={8}>
          <ListGroup>
            {follows.map((follow, index) => (
              <ListGroup.Item key={index}>
                {view === 'followers' ? follow.follower.username : follow.following.username}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default FollowsList;
