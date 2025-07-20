import React from 'react';
import { useState, useEffect } from 'react';
import { TrendingUp, Users, MessageSquare, FileText, DollarSign, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usersAPI, requestsAPI } from '../../services/api';
import { RequestCard } from '../../components/requests/RequestCard';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface Investor {
  _id: string;
  name: string;
  email: string;
  company: string;
  avatar: string;
  location: string;
  bio: string;
  investmentRange: {
    min: number;
    max: number;
  };
  industries: string[];
  portfolio: string[];
  createdAt?: string;
}

interface Request {
  _id: string;
  investor: {
    _id: string;
    name: string;
    avatar: string;
    company: string;
  };
  entrepreneur: {
    _id: string;
    name: string;
    avatar: string;
    startup: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  createdAt: string;
  updatedAt: string;
}

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInvestors: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    profileViews: 1234,
    messages: 156
  });

  useEffect(() => {
    fetchInvestors();
    fetchRequests();
    fetchStats();
  }, []);

  const fetchInvestors = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getInvestors({ limit: 100 });
      console.log('Investors response:', response);
      const investorsData = response.data || response || [];
      setInvestors(investorsData);
    } catch (error) {
      console.error('Failed to fetch investors:', error);
      setInvestors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await requestsAPI.getMyRequests();
      console.log('Requests response:', response);
      const requestsData = response.data || response || [];
      setRequests(requestsData);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      setRequests([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await usersAPI.getDashboardStats();
      console.log('Stats response:', response);
      const statsData = response.data || response || {};
      setStats({
        totalInvestors: 0,
        pendingRequests: 0,
        acceptedRequests: 0,
        profileViews: 1234,
        messages: 156,
        ...statsData
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({
        totalInvestors: investors.length,
        pendingRequests: 0,
        acceptedRequests: 0,
        profileViews: 1234,
        messages: 156
      });
    }
  };
  
  const pendingRequests = requests.filter(req => req.status === 'pending');
  const acceptedRequests = requests.filter(req => req.status === 'accepted');

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await requestsAPI.updateRequestStatus(requestId, 'accepted');
      fetchRequests();
      fetchStats();
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
    console.log('Accept request:', requestId);
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await requestsAPI.updateRequestStatus(requestId, 'rejected');
      fetchRequests();
      fetchStats();
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
    console.log('Reject request:', requestId);
  };

  const handleMessage = (userId: string) => {
    navigate(`/chat/${userId}`);
    console.log('Message user:', userId);
  };

  const statsData = [
    { label: 'Profile Views', value: stats.profileViews.toString(), icon: Eye, color: 'text-blue-600', change: '+12%' },
    { label: 'Total Investors', value: stats.totalInvestors.toString(), icon: Users, color: 'text-purple-600', change: '+8%' },
    { label: 'Pending Requests', value: stats.pendingRequests.toString(), icon: FileText, color: 'text-orange-600', change: '+3%' },
    { label: 'Messages', value: stats.messages.toString(), icon: MessageSquare, color: 'text-green-600', change: '+25%' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 dark:text-gray-300">Track your startup's progress and investor connections</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/profile')}>Update Profile</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
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

      {/* Recent Investors */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Investors</h2>
            <Button variant="outline" onClick={() => navigate('/investors')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : investors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No investors available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {investors.slice(0, 6).map(investor => (
                <div key={investor._id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <img
                    src={investor.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                    alt={investor.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{investor.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{investor.company}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMessage(investor._id)}
                  >
                    Message
                  </Button>
                </div>
              ))}
            </div>
          )}
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
              return (
                <RequestCard
                  key={request._id}
                  request={request}
                  userRole="entrepreneur"
                  otherUser={{
                    name: request.investor.name,
                    avatar: request.investor.avatar,
                    company: request.investor.company
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
              return (
                <RequestCard
                  key={request._id}
                  request={request}
                  userRole="entrepreneur"
                  otherUser={{
                    name: request.investor.name,
                    avatar: request.investor.avatar,
                    company: request.investor.company
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