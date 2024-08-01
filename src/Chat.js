import React, { useEffect, useState, useContext } from 'react';
import { useAuth } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const [notifications, setNotifications] = useState([]);
    const { auth } = useAuth();

    useEffect(() => {
        if (!auth.isLoggedIn) {
            return;
        }

        fetchMessages();
        fetchUnreadNotifications();

        // Polling for new messages and notifications every 5 seconds
        const intervalId = setInterval(() => {
            if (auth.isLoggedIn) {
                fetchMessages();
                fetchUnreadNotifications();
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [auth.isLoggedIn]);

    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:8080/chats/get', {
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
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

    const fetchUnreadNotifications = async () => {
        try {
            const response = await fetch(`http://localhost:8080/notifications/unread/${auth.userID}`, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                },
                credentials: 'include',
            });
            if (response.ok) {
                const notificationsData = await response.json();
                setNotifications(notificationsData);
            } else {
                console.error('Failed to fetch notifications');
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        // Update the state to mark the notification as read
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
                notification.id === notificationId ? { ...notification, read: true } : notification
            )
        );

        try {
            const response = await fetch(`http://localhost:8080/notifications/markAsRead/${notificationId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed to mark notification as read:', errorText);
            } else {
                // Remove the notification from the list once marked as read
                setNotifications((prevNotifications) =>
                    prevNotifications.filter(notification => notification.id !== notificationId)
                );
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

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

        try {
            const response = await fetch('http://localhost:8080/chats', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const sentMessage = await response.json();
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

    if (!auth.isLoggedIn) {
        return <div>Please log in to access the chat room.</div>;
    }

    return (
        <div className="container my-4">
            <h1 className="mb-4">Chat Room</h1>

            {/* Notifications List */}
            {notifications.length > 0 && (
                <div className="border rounded p-3 mb-4 notifications-list" style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                    <h4 className="mb-3">Unread Notifications</h4>
                    {notifications.map(notification => (
                        <div
                            key={notification.id}
                            className="alert alert-info mb-2"
                            onClick={() => markAsRead(notification.id)}  // Click handler to mark as read
                            style={{ cursor: 'pointer' }}
                        >
                            {notification.message}
                        </div>
                    ))}
                </div>
            )}

            {/* Messages List */}
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

            {/* Message Input */}
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
