import React, { useState } from 'react';
import { Filter, Clock, CheckCircle, XCircle } from 'lucide-react';
import { mockCollaborationRequests, mockUsers } from '../../data/mockData';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { RequestCard } from '../../components/requests/RequestCard';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const RequestsPage: React.FC = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Get requests relevant to the current user
  const userRequests = mockCollaborationRequests.filter(req => 
    req.investorId === user?.id || req.entrepreneurId === user?.id
  );

  const filteredRequests = userRequests.filter(req => 
    statusFilter === 'all' || req.status === statusFilter
  );

  const handleAcceptRequest = (requestId: string) => {
    console.log('Accept request:', requestId);
    // This would typically make an API call to update the request status
    alert('Request accepted!');
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Reject request:', requestId);
    // This would typically make an API call to update the request status
    alert('Request rejected!');
  };

  const handleMessage = (userId: string) => {
    console.log('Message user:', userId);
    // This would typically navigate to the chat page
    window.location.href = `/chat/${userId}`;
  };

  const getStatusCounts = () => {
    return {
      all: userRequests.length,
      pending: userRequests.filter(req => req.status === 'pending').length,
      accepted: userRequests.filter(req => req.status === 'accepted').length,
      rejected: userRequests.filter(req => req.status === 'rejected').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Collaboration Requests</h1>
            <p className="text-gray-600 dark:text-gray-300">
              {user?.role === 'investor' 
                ? 'Manage your investment requests and connections'
                : 'Review and respond to investor requests'
              }
            </p>
          </div>
        </div>

        {/* Status Filter */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Filter by status:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All ({statusCounts.all})
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('pending')}
                  icon={Clock}
                >
                  Pending ({statusCounts.pending})
                </Button>
                <Button
                  variant={statusFilter === 'accepted' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('accepted')}
                  icon={CheckCircle}
                >
                  Accepted ({statusCounts.accepted})
                </Button>
                <Button
                  variant={statusFilter === 'rejected' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('rejected')}
                  icon={XCircle}
                >
                  Rejected ({statusCounts.rejected})
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Requests Grid */}
        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map(request => {
              const otherUserId = user?.role === 'investor' ? request.entrepreneurId : request.investorId;
              const otherUser = mockUsers.find(u => u.id === otherUserId);
              
              return (
                <RequestCard
                  key={request.id}
                  request={request}
                  userRole={user?.role || 'entrepreneur'}
                  otherUser={{
                    name: otherUser?.name || 'Unknown User',
                    avatar: otherUser?.avatar,
                    company: user?.role === 'investor' 
                      ? mockUsers.find(u => u.id === request.entrepreneurId)?.name 
                      : mockUsers.find(u => u.id === request.investorId)?.name
                  }}
                  onAccept={handleAcceptRequest}
                  onReject={handleRejectRequest}
                  onMessage={handleMessage}
                />
              );
            })}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No {statusFilter !== 'all' ? statusFilter : ''} requests found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {statusFilter === 'all' 
                  ? "You don't have any collaboration requests yet."
                  : `No ${statusFilter} requests at the moment.`
                }
              </p>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};