import React from 'react';
import { MapPin, Building, TrendingUp, ExternalLink, MessageCircle, Eye } from 'lucide-react';
import { Investor } from '../../types';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface InvestorCardProps {
  investor: Investor;
  onMessage: (investorId: string) => void;
}

export const InvestorCard: React.FC<InvestorCardProps> = ({
  investor,
  onMessage
}) => {
  const navigate = useNavigate();

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const handleViewProfile = () => {
    navigate(`/profile/investor/${investor.id}`);
  };

  return (
    <Card hover className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar src={investor.avatar} alt={investor.name} size="md" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={handleViewProfile}>
                {investor.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{investor.company}</p>
            </div>
          </div>
          <Badge variant="secondary" size="sm">
            INVESTOR
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 mr-1" />
          {investor.location}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Investment Range</span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatAmount(investor.investmentRange.min)} - {formatAmount(investor.investmentRange.max)}
            </span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Focus Industries</p>
          <div className="flex flex-wrap gap-1">
            {investor.industries.slice(0, 3).map((industry, index) => (
              <Badge key={index} variant="info" size="sm">
                {industry}
              </Badge>
            ))}
            {investor.industries.length > 3 && (
              <Badge variant="info" size="sm">
                +{investor.industries.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {investor.bio}
        </p>

        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Portfolio Companies</p>
          <div className="flex flex-wrap gap-1">
            {investor.portfolio.slice(0, 3).map((company, index) => (
              <Badge key={index} variant="primary" size="sm">
                {company}
              </Badge>
            ))}
            {investor.portfolio.length > 3 && (
              <Badge variant="info" size="sm">
                +{investor.portfolio.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {investor.linkedin && (
            <a
              href={investor.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              LinkedIn
            </a>
          )}
          {investor.twitter && (
            <a
              href={investor.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Twitter
            </a>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex space-x-2 w-full">
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={handleViewProfile}
            className="flex-1"
          >
            View Profile
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={MessageCircle}
            onClick={() => onMessage(investor.id)}
            className="flex-1"
          >
            Send Message
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};