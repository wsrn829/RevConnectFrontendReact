import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import './DirectMessage.css';

const DirectMessage = () => {
  const { senderID, receiverID } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/messages/${senderID}/${receiverID}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error('Error fetching messages:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds for new messages

    return () => clearInterval(interval);
  }, [senderID, receiverID]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const message = {
        content: newMessage,
        sender: { userID: parseInt(senderID) },
        receiver: { userID: parseInt(receiverID) },
        timestamp: new Date()
      };

      try {
        const response = await fetch('/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        });

        if (response.ok) {
          setNewMessage('');
          const newMessageResponse = await response.json();
          setMessages(prevMessages => [...prevMessages, newMessageResponse]);
        } else {
          console.error('Error sending message:', response.statusText);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <Container className="direct-message-container">
      <Row className="justify-content-center mt-4">
        <Col md={8}>
          <div className="messages-box border rounded p-3 mb-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender.userID === parseInt(senderID) ? 'sent' : 'received'} mb-2`}
              >
                <div className="message-content p-2 rounded">
                  <span>{msg.content}</span>
                </div>
                <div className="message-timestamp text-muted small">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8}>
          <Form className="d-flex">
            <Form.Control
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="me-2 message-input"
            />
            <Button variant="primary" onClick={sendMessage}>
              Send
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default DirectMessage;
