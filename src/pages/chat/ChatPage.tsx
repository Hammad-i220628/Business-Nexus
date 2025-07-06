import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Phone, Video, MoreVertical, User } from 'lucide-react';
import { mockMessages, mockUsers } from '../../data/mockData';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const ChatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherUser = mockUsers.find(u => u.id === userId);

  // Filter messages between current user and the other user
  const chatMessages = messages
    .filter(msg => 
      (msg.senderId === currentUser?.id && msg.receiverId === userId) ||
      (msg.senderId === userId && msg.receiverId === currentUser?.id)
    )
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  if (!otherUser) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Not Found</h2>
          <Button onClick={() => navigate('/messages')} icon={ArrowLeft}>
            Back to Messages
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && currentUser) {
      const message = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        receiverId: userId!,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        read: false
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)]">
        <Card className="h-full flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ArrowLeft}
                  onClick={() => navigate('/messages')}
                />
                <Avatar
                  src={otherUser.avatar}
                  alt={otherUser.name}
                  size="md"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{otherUser.name}</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{otherUser.role}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" icon={Phone} />
                <Button variant="ghost" size="sm" icon={Video} />
                <Button variant="ghost" size="sm" icon={MoreVertical} />
              </div>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                <p className="text-center">Send a message to {otherUser.name} to get started.</p>
              </div>
            ) : (
              <>
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                      message.senderId === currentUser?.id ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <Avatar
                        src={message.senderId === currentUser?.id ? currentUser.avatar : otherUser.avatar}
                        alt={message.senderId === currentUser?.id ? currentUser.name : otherUser.name}
                        size="sm"
                        className="flex-shrink-0"
                      />
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          message.senderId === currentUser?.id
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === currentUser?.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl">
            <div className="flex space-x-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${otherUser.name}...`}
                rows={1}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                icon={Send}
                className="self-end"
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};