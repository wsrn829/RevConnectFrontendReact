import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css';

const ProfilePage = () => {
  const { auth } = useAuth();
  const { userId: profileUserId } = useParams();
  const [user, setUser] = useState({
    username: '',
    firstname: '',
    lastname: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/${profileUserId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, [profileUserId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const payload = {
            userID: parseInt(profileUserId),
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            bio: user.bio
        };

        console.log('Submitting user data:', payload);

        const response = await fetch(`http://localhost:8080/users/${profileUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${errorText}`);
        }

        setSuccess('Profile updated successfully');
        setError('');
    } catch (error) {
        console.error('Error updating profile:', error);
        setError(`Failed to update profile: ${error.message}`);
        setSuccess('');
    }
};

  return (
    <Container className="mt-4 profile-container">
      <h2 className="text-center mb-4">Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
        <Form.Group as={Row} controlId="username" className="mb-3">
        <Form.Label column sm={2} style={{ fontWeight: 'bold', fontFamily: 'Arial' }}>Username</Form.Label>
        <Col sm={10}>
            <Form.Control
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              readOnly={auth.userID !== profileUserId}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="firstname" className="mb-3">
          <Form.Label column sm={2} style={{ fontWeight: 'bold', fontFamily: 'Arial' }}>First Name</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="firstname"
              value={user.firstname}
              onChange={handleChange}
              readOnly={auth.userID !== profileUserId}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="lastname" className="mb-3">
          <Form.Label column sm={2} style={{ fontWeight: 'bold', fontFamily: 'Arial' }}>Last Name</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="lastname"
              value={user.lastname}
              onChange={handleChange}
              readOnly={auth.userID !== profileUserId}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="bio" className="mb-3">
          <Form.Label column sm={2} style={{ fontWeight: 'bold', fontFamily: 'Arial' }}>Bio</Form.Label>
          <Col sm={10}>
            <Form.Control
              as="textarea"
              name="bio"
              value={user.bio}
              onChange={handleChange}
              readOnly={auth.userID !== profileUserId}
              rows={3}
            />
          </Col>
        </Form.Group>
        {auth.userID === profileUserId && (
          <div className="text-center">
            <Button variant="info" type="submit">
              Save Changes
            </Button>
          </div>
        )}
      </Form>
    </Container>
  );
};

export default ProfilePage;
