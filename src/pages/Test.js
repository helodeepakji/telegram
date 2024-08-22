import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:8000');

function Test() {
    const [username, setUsername] = useState('user');
    const [userId, setUserId] = useState(0);
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [joined, setJoined] = useState(false);
    useEffect(() => {
        console.log('start');
        fetch('/username')
            .then(response => response.json())
            .then(data => {
                setUsername(data.username);
                setUserId(data.user_id)
                socket.emit('userLogin', data.user_id);
            })
            .catch(error => {
                console.error('Error fetching username:', error);
            });
    }, []);


    useEffect(() => {
        socket.on('receiveMessage', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        socket.on('updateUsers', (userList) => {
            setUsers(userList);
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('updateUsers');
        };
    }, []);

    const joinRoom = () => {
        if (room !== '') {
            socket.emit('joinRoom', room);
            socket.emit('setUsername', username);
            setJoined(true);
        }
    };

    const sendMessage = () => {
        if (message !== '') {
            socket.emit('sendMessage', { room, message });
            setMessage('');
        }
    };

    return (
        <div>
            {!joined ? (
                <div>
                    <h2>Join a Room</h2>
                    <input
                        type="text"
                        placeholder="Room ID"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                    />
                    <button onClick={joinRoom}>Join Room</button>
                </div>
            ) : (
                <div>
                    <h2>Room: {room}</h2>
                    <div>
                        {messages.map((msg, index) => (
                            <div key={index}>{msg.sender}: {msg.message}</div>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={sendMessage}>Send Message</button>
                </div>
            )}
        </div>
    );
}

export default Test;
