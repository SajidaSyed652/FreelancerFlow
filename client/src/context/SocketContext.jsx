import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    let socketUrl = import.meta.env.VITE_SOCKET_URL;
    if (!socketUrl) {
      if (import.meta.env.PROD) {
        socketUrl = 'https://freelancerflow-h0gp.onrender.com';
      } else {
        socketUrl = 'http://localhost:5000';
      }
    }
    socketUrl = socketUrl.trim().replace(/\/$/, '').replace(/\/api$/, '');

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      newSocket.emit('join_user', user._id);
    });

    newSocket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('user_typing', ({ user: typingUser }) => {
      setTypingUsers((prev) => new Set([...prev, typingUser]));
    });

    newSocket.on('user_stop_typing', () => {
      setTypingUsers(new Set());
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const joinProjectChat = (projectId) => {
    if (socket && projectId) {
      if (activeProject) {
        socket.emit('leave_project', activeProject);
      }
      socket.emit('join_project', projectId);
      setActiveProject(projectId);
      setMessages([]);
    }
  };

  const sendProjectMessage = (projectId, text, senderId, receiverId, sender) => {
    if (socket && text.trim()) {
      const payload = {
        projectId,
        text,
        senderId: {
          _id: senderId,
          name: sender.name,
          avatar: sender.avatar,
          role: sender.role,
        },
        receiverId,
        createdAt: new Date().toISOString(),
      };
      socket.emit('send_message', payload);
    }
  };

  const emitTyping = (projectId, userName) => {
    if (socket) {
      socket.emit('typing', { projectId, user: userName });
    }
  };

  const emitStopTyping = (projectId) => {
    if (socket) {
      socket.emit('stop_typing', { projectId });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        messages,
        setMessages,
        joinProjectChat,
        sendProjectMessage,
        emitTyping,
        emitStopTyping,
        typingUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
