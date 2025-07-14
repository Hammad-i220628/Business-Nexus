import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const connectedUsers = new Map();

export const setupSocketHandlers = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user || !user.isActive) {
        return next(new Error('Authentication error'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.name} connected`);
    
    // Store user connection
    connectedUsers.set(socket.userId, socket.id);
    
    // Join user to their own room for notifications
    socket.join(socket.userId);

    // Handle joining chat rooms
    socket.on('joinChat', (otherUserId) => {
      const roomId = [socket.userId, otherUserId].sort().join('-');
      socket.join(roomId);
      console.log(`User ${socket.user.name} joined chat room: ${roomId}`);
    });

    // Handle leaving chat rooms
    socket.on('leaveChat', (otherUserId) => {
      const roomId = [socket.userId, otherUserId].sort().join('-');
      socket.leave(roomId);
      console.log(`User ${socket.user.name} left chat room: ${roomId}`);
    });

    // Handle real-time messaging
    socket.on('sendMessage', (data) => {
      const { receiverId, content } = data;
      const roomId = [socket.userId, receiverId].sort().join('-');
      
      // Emit to the chat room
      socket.to(roomId).emit('newMessage', {
        sender: {
          _id: socket.userId,
          name: socket.user.name,
          avatar: socket.user.avatar
        },
        receiver: {
          _id: receiverId
        },
        content,
        createdAt: new Date(),
        read: false
      });

      // Also emit to receiver's personal room for notifications
      socket.to(receiverId).emit('messageNotification', {
        senderId: socket.userId,
        senderName: socket.user.name,
        content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
        timestamp: new Date()
      });
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      const { receiverId, isTyping } = data;
      const roomId = [socket.userId, receiverId].sort().join('-');
      
      socket.to(roomId).emit('userTyping', {
        userId: socket.userId,
        userName: socket.user.name,
        isTyping
      });
    });

    // Handle online status
    socket.on('getOnlineStatus', (userIds) => {
      const onlineStatus = {};
      userIds.forEach(userId => {
        onlineStatus[userId] = connectedUsers.has(userId);
      });
      socket.emit('onlineStatus', onlineStatus);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.name} disconnected`);
      connectedUsers.delete(socket.userId);
      
      // Broadcast user offline status
      socket.broadcast.emit('userOffline', {
        userId: socket.userId,
        userName: socket.user.name
      });
    });

    // Handle connection errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Broadcast user online status
    socket.broadcast.emit('userOnline', {
      userId: socket.userId,
      userName: socket.user.name
    });
  });

  // Helper function to get online users
  io.getOnlineUsers = () => {
    return Array.from(connectedUsers.keys());
  };

  // Helper function to check if user is online
  io.isUserOnline = (userId) => {
    return connectedUsers.has(userId);
  };

  // Helper function to send notification to specific user
  io.sendNotificationToUser = (userId, event, data) => {
    const socketId = connectedUsers.get(userId);
    if (socketId) {
      io.to(socketId).emit(event, data);
      return true;
    }
    return false;
  };
};