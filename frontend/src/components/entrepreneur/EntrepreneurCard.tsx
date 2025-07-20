import React from 'react';
import { MapPin, TrendingUp, Users, ExternalLink, MessageCircle, Eye } from 'lucide-react';
import { Entrepreneur } from '../../types';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const defaultUserIcon = (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="5" fill="#bbb" />
    <path d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6" fill="#bbb" />
  </svg>
);

interface EntrepreneurCardProps {
  entrepreneur: Entrepreneur;
  onMessage: (entrepreneurId: string) => void;
  onRequest: (entrepreneurId: string) => void;
}

export const EntrepreneurCard: React.FC<EntrepreneurCardProps> = ({
  entrepreneur,
  onMessage,
  onRequest
}) => {
  const navigate = useNavigate();

  const formatFunding = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'idea': return 'info';
      case 'prototype': return 'warning';
      case 'mvp': return 'primary';
      case 'growth': return 'success';
      case 'expansion': return 'secondary';
      default: return 'info';
    }
  };

  const handleViewProfile = () => {
    navigate(`/profile/entrepreneur/${entrepreneur.id}`);
  };

  return (
    <Card hover className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {defaultUserIcon}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={handleViewProfile}>
                {entrepreneur.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{entrepreneur.startup}</p>
            </div>
          </div>
          <Badge variant={getStageColor(entrepreneur.stage) as any} size="sm">
            {entrepreneur.stage.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 mr-1" />
          {entrepreneur.location}
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            {entrepreneur.industry}
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 mr-1" />
            {entrepreneur.teamSize} people
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Funding Needed</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatFunding(entrepreneur.fundingNeeded)}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {entrepreneur.pitchSummary}
        </p>

        {entrepreneur.website && (
          <a
            href={entrepreneur.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Visit Website
          </a>
        )}
      </CardContent>

      <CardFooter>
        <div className="flex space-x-2 w-full">
          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={handleViewProfile}
            className="flex-1"
          >
            View Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={MessageCircle}
            onClick={() => onMessage(entrepreneur.id)}
            className="flex-1"
          >
            Message
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onRequest(entrepreneur.id)}
            className="flex-1"
          >
            Send Request
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};