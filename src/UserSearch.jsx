import React, { useState, useEffect } from 'react';
import { Card, Button, Form, FormControl } from 'react-bootstrap';
import { useAuth } from './AuthContext';

const UserSearch = () => {
  const { auth } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  useEffect(() => {
    const fetchFollowingList = async () => {
      try {
        const response = await fetch(`http://localhost:8080/follows/follower/${auth.userID}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Following List:', data);

        const followingUsernames = data.map(follow => follow.followingUsername);
        setFollowingList(followingUsernames);
      } catch (error) {
        console.error('Error fetching following list:', error);
      }
    };

    fetchFollowingList();
  }, [auth]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users/search?query=${searchQuery}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleFollow = async (followingID, username) => {
    try {
      const response = await fetch(`http://localhost:8080/follow?followingID=${followingID}`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        console.log('Successfully followed.');
        setFollowingList([...followingList, username]);
      } else {
        const text = await response.text();
        console.error('Error following user:', response.statusText, text);
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (followingID, username) => {
    try {
      const response = await fetch(`http://localhost:8080/unfollow?followerID=${auth.userID}&followingID=${followingID}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        console.log('Successfully unfollowed.');
        setFollowingList(followingList.filter(user => user !== username));
      } else {
        const text = await response.text();
        console.error('Error unfollowing user:', response.statusText, text);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const isFollowing = (username) => {
    console.log('Following Check:', followingList);
    return followingList.includes(username);
  };

  return (
    <div>
      <Form className="d-flex" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <FormControl
          type="search"
          placeholder="Search users"
          className="me-2"
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="outline-success" onClick={handleSearch}>Search</Button>
      </Form>
      <div>
        {searchResults.map(user => (
          <Card key={user.username} className="mt-3">
            <Card.Body>
              <Card.Title>{user.username}</Card.Title>
              <Card.Text>{user.bio}</Card.Text>
              {isFollowing(user.username) ? (
                <Button variant="danger" onClick={() => handleUnfollow(user.userID, user.username)}>Unfollow</Button>
              ) : (
                <Button variant="info" onClick={() => handleFollow(user.userID, user.username)}>Follow</Button>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default UserSearch;
