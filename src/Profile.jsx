import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, ListGroup, ListGroupItem, Nav, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = ({ userId }) => {
  const [user, setUser] = useState({});
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [activeTab, setActiveTab] = useState('followers');
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState({
    username: '',
    firstname: '',
    lastname: '',
    bio: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const userResponse = await fetch(`/users/${userId}`);
      const userData = await userResponse.json();
      setUser(userData);
      setEditUser({
        username: userData.username,
        firstname: userData.firstname,
        lastname: userData.lastname,
        bio: userData.bio
      });

      const followersResponse = await fetch(`/follows/follower/${userId}`);
      const followersData = await followersResponse.json();
      setFollowers(followersData);

      const followingsResponse = await fetch(`/follows/following/${userId}`);
      const followingsData = await followingsResponse.json();
      setFollowings(followingsData);
    };

    fetchData();
  }, [userId]);

  const handleFollowToggle = async (follow) => {
    if (activeTab === 'followers') {
      await fetch(`/unfollow?followerID=${userId}&followingID=${follow.follower.userID}`, { method: 'DELETE' });
    } else {
      await fetch(`/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ follower: { userID: userId }, following: { userID: follow.following.userID } })
      });
    }

    const updatedFollowersResponse = await fetch(`/follows/follower/${userId}`);
    const updatedFollowersData = await updatedFollowersResponse.json();
    setFollowers(updatedFollowersData);

    const updatedFollowingsResponse = await fetch(`/follows/following/${userId}`);
    const updatedFollowingsData = await updatedFollowingsResponse.json();
    setFollowings(updatedFollowingsData);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const response = await fetch(`/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editUser)
    });
    const updatedUser = await response.json();
    setUser(updatedUser);
    setIsEditing(false);
  };

  const renderFollowList = (follows) => {
    return (
      <ListGroup>
        {follows.map(follow => (
          <ListGroupItem key={follow.followID}>
            {activeTab === 'followers' ? follow.follower.username : follow.following.username}
            <Button variant="primary" size="sm" className="ml-3" onClick={() => handleFollowToggle(follow)}>
              {activeTab === 'followers' ? 'Unfollow' : 'Follow'}
            </Button>
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <Card>
            <Card.Body>
              {isEditing ? (
                <Form onSubmit={handleSaveProfile}>
                  <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={editUser.username}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formFirstname">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstname"
                      value={editUser.firstname}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formLastname">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastname"
                      value={editUser.lastname}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBio">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="bio"
                      value={editUser.bio}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Save
                  </Button>
                  <Button variant="secondary" onClick={handleEditToggle} className="ml-2">
                    Cancel
                  </Button>
                </Form>
              ) : (
                <>
                  <Card.Title>{user.username}</Card.Title>
                  <Card.Text>
                    <strong>Name: </strong> {user.firstname} {user.lastname} <br />
                    <strong>Bio: </strong> {user.bio}
                  </Card.Text>
                  <Button variant="primary" onClick={handleEditToggle}>
                    Edit Profile
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col md={8}>
          <Nav variant="tabs" defaultActiveKey="#followers">
            <Nav.Item>
              <Nav.Link href="#followers" onClick={() => setActiveTab('followers')}>Followers</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#followings" onClick={() => setActiveTab('followings')}>Followings</Nav.Link>
            </Nav.Item>
          </Nav>
          {activeTab === 'followers' ? renderFollowList(followers) : renderFollowList(followings)}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
