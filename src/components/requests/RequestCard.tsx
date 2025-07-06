import React from 'react';
import { Clock, CheckCircle, XCircle, User } from 'lucide-react';
import { CollaborationRequest } from '../../types';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface RequestCardProps {
  request: CollaborationRequest;
  userRole: 'investor' | 'entrepreneur';
  otherUser: {
    name: string;
    avatar?: string;
    company?: string;
  };
  onAccept?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onMessage?: (userId: string) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  userRole,
  otherUser,
  onAccept,
  onReject,
  onMessage
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'rejected': return 'danger';
      default: return 'info';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'accepted': return CheckCircle;
      case 'rejected': return XCircle;
      default: return Clock;
    }
  };

  const StatusIcon = getStatusIcon(request.status);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar src={otherUser.avatar} alt={otherUser.name} size="md" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{otherUser.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{otherUser.company}</p>
            </div>
          </div>
          <Badge variant={getStatusColor(request.status) as any} size="sm">
            <StatusIcon className="w-3 h-3 mr-1" />
            {request.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">{request.message}</p>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Sent {new Date(request.createdAt).toLocaleDateString()}
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex space-x-2 w-full">
          {request.status === 'pending' && userRole === 'entrepreneur' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject?.(request.id)}
                className="flex-1"
              >
                Decline
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onAccept?.(request.id)}
                className="flex-1"
              >
                Accept
              </Button>
            </>
          )}
          
          {request.status === 'accepted' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onMessage?.(userRole === 'investor' ? request.entrepreneurId : request.investorId)}
              className="w-full"
            >
              Continue Conversation
            </Button>
          )}
          
          {request.status === 'pending' && userRole === 'investor' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMessage?.(request.entrepreneurId)}
              className="w-full"
            >
              Follow Up
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};