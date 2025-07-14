import React from 'react';
import { TrendingUp, Users, MessageSquare, FileText, DollarSign, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockCollaborationRequests, mockInvestors } from '../../data/mockData';
import { RequestCard } from '../../components/requests/RequestCard';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const userRequests = mockCollaborationRequests.filter(req => req.entrepreneurId === user?.id);
  const pendingRequests = userRequests.filter(req => req.status === 'pending');
  const acceptedRequests = userRequests.filter(req => req.status === 'accepted');

  const handleAcceptRequest = (requestId: string) => {
    console.log('Accept request:', requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Reject request:', requestId);
  };

  const handleMessage = (userId: string) => {
    console.log('Message user:', userId);
  };

  const stats = [
    { label: 'Profile Views', value: '1,234', icon: Eye, color: 'text-blue-600', change: '+12%' },
    { label: 'Investor Interests', value: '89', icon: Users, color: 'text-purple-600', change: '+8%' },
    { label: 'Active Requests', value: pendingRequests.length.toString(), icon: FileText, color: 'text-orange-600', change: '+3%' },
    { label: 'Messages', value: '156', icon: MessageSquare, color: 'text-green-600', change: '+25%' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 dark:text-gray-300">Track your startup's progress and investor connections</p>
        </div>
        <Button variant="primary">Update Profile</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">{stat.change}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300">New investor viewed your profile</p>
              <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300">Collaboration request accepted</p>
              <span className="text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300">New message from investor</p>
              <span className="text-xs text-gray-500 dark:text-gray-400">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Pending Requests ({pendingRequests.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRequests.map(request => {
              const investor = mockInvestors.find(inv => inv.id === request.investorId);
              return (
                <RequestCard
                  key={request.id}
                  request={request}
                  userRole="entrepreneur"
                  otherUser={{
                    name: investor?.name || 'Unknown',
                    avatar: investor?.avatar,
                    company: investor?.company
                  }}
                  onAccept={handleAcceptRequest}
                  onReject={handleRejectRequest}
                  onMessage={handleMessage}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Accepted Connections */}
      {acceptedRequests.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Active Connections ({acceptedRequests.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {acceptedRequests.map(request => {
              const investor = mockInvestors.find(inv => inv.id === request.investorId);
              return (
                <RequestCard
                  key={request.id}
                  request={request}
                  userRole="entrepreneur"
                  otherUser={{
                    name: investor?.name || 'Unknown',
                    avatar: investor?.avatar,
                    company: investor?.company
                  }}
                  onMessage={handleMessage}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};