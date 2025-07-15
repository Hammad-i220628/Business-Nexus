import React, { useState } from 'react';
import { Send, Search, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import { mockMessages, mockUsers } from '../../data/mockData';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Responsive: detect mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Get unique conversations for the current user
  const conversations = mockMessages
    .filter(msg => msg.senderId === user?.id || msg.receiverId === user?.id)
    .reduce((acc, msg) => {
      const otherUserId = msg.senderId === user?.id ? msg.receiverId : msg.senderId;
      if (!acc[otherUserId]) {
        acc[otherUserId] = {
          otherUser: mockUsers.find(u => u.id === otherUserId),
          messages: [],
          lastMessage: msg
        };
      }
      acc[otherUserId].messages.push(msg);
      if (new Date(msg.timestamp) > new Date(acc[otherUserId].lastMessage.timestamp)) {
        acc[otherUserId].lastMessage = msg;
      }
      return acc;
    }, {} as Record<string, any>);

  const conversationList = Object.values(conversations).sort((a: any, b: any) => 
    new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
  );

  const selectedConversation = selectedChat ? conversations[selectedChat] : null;

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      console.log('Send message:', newMessage, 'to:', selectedChat);
      setNewMessage('');
    }
  };

  return (
    <DashboardLayout>
      <div className={`flex h-[calc(100vh-8rem)] gap-6 ${isMobile ? 'flex-col' : ''}`}>
        {/* Conversations List */}
        <Card className={`${isMobile ? (selectedChat ? 'hidden' : 'block') : 'block'} w-full md:w-80 flex flex-col`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
            </div>
            <div className="mt-4">
              <Input
                icon={Search}
                placeholder="Search conversations..."
                size="sm"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="space-y-1">
              {conversationList.map((conversation: any) => (
                <div
                  key={conversation.otherUser.id}
                  onClick={() => setSelectedChat(conversation.otherUser.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedChat === conversation.otherUser.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={conversation.otherUser.avatar}
                      alt={conversation.otherUser.name}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {conversation.otherUser.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(conversation.lastMessage.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className={`${isMobile ? (!selectedChat ? 'hidden' : 'block') : 'block'} flex-1 flex flex-col`}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Back button for mobile */}
                    {isMobile && (
                      <button onClick={() => setSelectedChat(null)} className="mr-2 text-blue-500" aria-label="Back">
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                    )}
                    <Avatar
                      src={selectedConversation.otherUser.avatar}
                      alt={selectedConversation.otherUser.name}
                      size="md"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {selectedConversation.otherUser.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedConversation.otherUser.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" icon={Phone} />
                    <Button variant="ghost" size="sm" icon={Video} />
                    <Button variant="ghost" size="sm" icon={MoreVertical} />
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
                {selectedConversation.messages
                  .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                  .map((message: any) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === user?.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    icon={Send}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p>Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};