import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Navbar from './Navbar';
import ChatRoom from './Chat';
import FollowsList from './FollowsList';
import Profile from './Profile';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import UserSearch from './UserSearch';
import PostForm from './PostForm';

function App() {

  return (
    <Router>
      <Navbar />
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chats" element={<ChatRoom />} />
          <Route path="/follows/:userID" element={<FollowsList />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/search" element={<UserSearch />} />
          <Route path="/posts" element={<PostForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
