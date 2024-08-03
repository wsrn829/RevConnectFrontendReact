import { useAuth } from './AuthContext'; // Import the useAuth hook
import { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

const FollowsList = () => {
  const { auth } = useAuth(); // Use the auth context
  const [follows, setFollows] = useState([]);
  const [view, setView] = useState('followers');

  useEffect(() => {
    const fetchFollows = async () => {
      try {
        const response = await fetch(`http://localhost:8080/follows?userID=${auth.userID}&type=${view}`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`, // Include the token in the headers
          },
          credentials: 'include', // Include credentials (cookies)
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        // console.log('Follows data:', data);

        // Set the follows data directly without additional filtering
        setFollows(data);
      } catch (error) {
        console.error('Error fetching follows:', error);
      }
    };

    if (auth.isLoggedIn) {
      fetchFollows();
    }
  }, [auth, view]);

  const handleToggle = (value) => {
    console.log('Toggled view to:', value);
    setView(value);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center mb-3">
        <ToggleButtonGroup type="radio" name="viewOptions" defaultValue="followers" onChange={handleToggle}>
          <ToggleButton id="tbg-radio-1" value={'followers'} variant="outline-info">
            Following
          </ToggleButton>
          <ToggleButton id="tbg-radio-2" value={'following'} variant="outline-info">
            Followers
          </ToggleButton>
        </ToggleButtonGroup>
      </Row>
      <Row className="justify-content-center">
        <Col md={8}>
          <ListGroup>
            {follows.map((follow, index) => (
              <ListGroup.Item key={index}>
                {view === 'followers' ? (
                  <>
                    <strong>{follow.followingUsername}</strong>: {follow.followingBio}
                  </>
                ) : (
                  <>
                    <strong>{follow.followerUsername}</strong>: {follow.followerBio}
                  </>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default FollowsList;
