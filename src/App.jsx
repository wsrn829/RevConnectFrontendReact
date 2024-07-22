import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Navbar from './Navbar';
import DirectMessage from './DirectMessage';
import FollowsList from './FollowsList';
// import LoginPage from './LoginPage';
// import RegisterPage from './RegisterPage';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-5">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/messages/:senderID/:receiverID" element={<DirectMessage />} />
        <Route path="/follows/:userID" element={<FollowsList />} />
        {/* <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> */}
      </Routes>
      </div>
    </Router>
  );
}

export default App;
