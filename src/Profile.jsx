import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfilePage = () => {
  const { auth } = useAuth(); // Use useAuth to get auth details
  const { userId: profileUserId } = useParams(); // Get userId from URL
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
            userID: parseInt(profileUserId), // Ensure userID is included and an integer
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            bio: user.bio
        };

        console.log('Submitting user data:', payload); // Log the user data

        const response = await fetch(`http://localhost:8080/users/${profileUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Ensure cookies are included in the request
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text(); // Get error message from response
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
    <Container className="mt-4">
      <h2>Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            readOnly={auth.userID !== profileUserId}
          />
        </Form.Group>
        <Form.Group controlId="firstname">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstname"
            value={user.firstname}
            onChange={handleChange}
            readOnly={auth.userID !== profileUserId}
          />
        </Form.Group>
        <Form.Group controlId="lastname">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastname"
            value={user.lastname}
            onChange={handleChange}
            readOnly={auth.userID !== profileUserId}
          />
        </Form.Group>
        <Form.Group controlId="bio">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            name="bio"
            value={user.bio}
            onChange={handleChange}
            readOnly={auth.userID !== profileUserId}
          />
        </Form.Group>
        {auth.userID === profileUserId && (
          <Button variant="info" type="submit">
            Save Changes
          </Button>
        )}
      </Form>
    </Container>
  );
};

export default ProfilePage;
