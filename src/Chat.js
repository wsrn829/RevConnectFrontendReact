import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChatRoom = () => {
    const { userID } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const { auth, token } = useAuth();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:8080/chats/get`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                } else {
                    console.error('Failed to fetch messages');
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        if (auth.isLoggedIn) {
            fetchMessages();
        }
    }, [auth, token]);

    const handleSendMessage = async () => {
      const parsedReceiverId = parseInt(receiverId, 10);

      if (isNaN(parsedReceiverId)) {
          console.error('Invalid receiver ID');
          return;
      }

      const requestBody = {
          message: newMessage,
          sender: { userID: auth.userID },
          receiver: { userID: parsedReceiverId },
      };

      console.log('Sending message with payload:', requestBody);

      try {
          const response = await fetch('http://localhost:8080/chats', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify(requestBody),
          });

          console.log('Response status:', response.status);

          if (response.ok) {
              const sentMessage = await response.json();
              console.log('Message sent successfully:', sentMessage);
              setMessages((prevMessages) => [...prevMessages, sentMessage]);
              setNewMessage('');
              setReceiverId('');
          } else {
              const errorText = await response.text();
              console.error(`Failed to send message. Status: ${response.status}. Error: ${errorText}`);
          }
      } catch (error) {
          console.error('Error sending message:', error);
      }
  };

  return (
    <div className="container my-4">
        <h1 className="mb-4">Chat Room</h1>
        <div className="border rounded p-3 mb-4 chat-messages" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
            {messages.map((msg, index) => (
                <div
                key={index}
                className={`d-flex flex-column mb-2 ${msg.sender.userID === auth.userID ? 'align-self-end' : 'align-self-start'}`}
            >
                <div
                    className={`message p-3 rounded ${msg.sender.userID === auth.userID ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                    style={{ maxWidth: '70%' }}
                >
                    {msg.receiver && (
                        <p className="mb-1 fw-bold">
                            To: {msg.receiver.username}
                        </p>
                    )}
                    <p className="mb-1">{msg.message}</p>
                    <p className="mb-0 text-muted small">
                        {msg.sender.userID === auth.userID
                            ? `You`
                            : `User ${msg.sender.username}`}
                    </p>
                </div>
            </div>

            ))}
        </div>
        <div className="input-group mb-3">
            <input
                type="text"
                className="form-control"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                placeholder="Enter receiver ID..."
            />
            <input
                type="text"
                className="form-control"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <button className="btn btn-info" onClick={handleSendMessage}>Send</button>
        </div>
    </div>
  );
};

export default ChatRoom;
