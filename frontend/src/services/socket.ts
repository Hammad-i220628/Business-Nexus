import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    this.token = token;
    
    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinChat(otherUserId: string) {
    if (this.socket) {
      this.socket.emit('joinChat', otherUserId);
    }
  }

  leaveChat(otherUserId: string) {
    if (this.socket) {
      this.socket.emit('leaveChat', otherUserId);
    }
  }

  sendMessage(receiverId: string, content: string) {
    if (this.socket) {
      this.socket.emit('sendMessage', { receiverId, content });
    }
  }

  onNewMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('newMessage', callback);
    }
  }

  onMessageNotification(callback: (notification: any) => void) {
    if (this.socket) {
      this.socket.on('messageNotification', callback);
    }
  }

  onUserTyping(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('userTyping', callback);
    }
  }

  onUserOnline(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('userOnline', callback);
    }
  }

  onUserOffline(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('userOffline', callback);
    }
  }

  sendTyping(receiverId: string, isTyping: boolean) {
    if (this.socket) {
      this.socket.emit('typing', { receiverId, isTyping });
    }
  }

  getOnlineStatus(userIds: string[]) {
    if (this.socket) {
      this.socket.emit('getOnlineStatus', userIds);
    }
  }

  onOnlineStatus(callback: (status: any) => void) {
    if (this.socket) {
      this.socket.on('onlineStatus', callback);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export const socketService = new SocketService();
export default socketService; 