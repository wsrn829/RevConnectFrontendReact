import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Chat.css';

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { auth } = useAuth();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!auth.isLoggedIn) {
            return;
        }

        fetchMessages();
        fetchUnreadNotifications();
        fetchUsers();

        // Polling for new messages and notifications every 5 seconds
        const intervalId = setInterval(() => {
            if (auth.isLoggedIn) {
                fetchMessages();
                fetchUnreadNotifications();
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [auth.isLoggedIn]);

    useEffect(() => {
        // Scroll to the bottom of the messages list whenever messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

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

    const fetchUsers = async (query = '') => {
        try {
            const response = await fetch(`http://localhost:8080/users/search?query=${query}`, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                },
                credentials: 'include',
            });
            if (response.ok) {
                const usersData = await response.json();
                setUsers(usersData);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
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

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        fetchUsers(query);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    if (!auth.isLoggedIn) {
        return <div>Please log in to access the chat room.</div>;
    }

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8">
                    <h1 className="mb-4 text-center">Chat Room</h1>

                    {/* Notifications List */}
                    {notifications.length > 0 && (
                        <div className="border rounded p-3 mb-4 notifications-list bg-light" style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                            {notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className="alert mb-2"
                                    onClick={() => markAsRead(notification.id)}
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: '#e0bbff',
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        padding: '10px',
                                        margin: '5px 0',
                                        borderRadius: '5px',
                                        color: notification.read ? '#fff' : '#000',
                                    }}
                                >
                                    {notification.message}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Messages List */}
                    <div className="border rounded p-3 mb-4 chat-messages bg-light" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`d-flex flex-column mb-2 ${msg.sender.userID === auth.userID ? 'align-self-end' : 'align-self-start'}`}
                            >
                                <div
                                    className={`message p-3 rounded shadow-sm ${msg.sender.userID === auth.userID ? 'bg-success text-white' : 'bg-light-purple'}`}
                                    style={{ maxWidth: '75%', wordWrap: 'break-word' }}
                                >
                                    {msg.receiver && (
                                        <p className="mb-1 fw-bold" style={{ fontSize: '0.9rem' }}>
                                            To: {msg.receiver.username}
                                        </p>
                                    )}
                                    <p className="mb-1" style={{ fontSize: '1rem' }}>{msg.message}</p>
                                    <p className="mb-0 text-muted small" style={{ fontSize: '0.8rem' }}>
                                        {msg.sender.userID === auth.userID
                                            ? `You`
                                            : `User ${msg.sender.username}`}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="mb-3">
                        <div className="input-group mb-2">
                            <select
                                className="form-select"
                                value={receiverId}
                                onChange={(e) => setReceiverId(e.target.value)}
                            >
                                <option value="">Select a user</option>
                                {users.map(user => (
                                    <option key={user.userID} value={user.userID}>
                                        {user.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                            />
                            <button className="btn btn-info" onClick={handleSendMessage}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    }
    export default ChatRoom;
