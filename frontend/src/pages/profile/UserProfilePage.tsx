import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Send, MapPin, Building, TrendingUp, Users, ExternalLink, DollarSign } from 'lucide-react';
import { mockUsers, mockEntrepreneurs, mockInvestors } from '../../data/mockData';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';

export const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const user = mockUsers.find(u => u.id === id);
  const entrepreneur = mockEntrepreneurs.find(e => e.id === id);
  const investor = mockInvestors.find(i => i.id === id);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Not Found</h2>
          <Button onClick={() => navigate(-1)} icon={ArrowLeft}>
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleMessage = () => {
    navigate(`/chat/${user.id}`);
  };

  const handleSendRequest = () => {
    console.log('Send collaboration request to:', user.id);
    // This would typically make an API call
    alert('Collaboration request sent!');
  };

  const formatFunding = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              icon={MessageCircle}
              onClick={handleMessage}
            >
              Message
            </Button>
            {user.role === 'entrepreneur' && currentUser?.role === 'investor' && (
              <Button
                variant="primary"
                icon={Send}
                onClick={handleSendRequest}
              >
                Send Request
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="text-center">
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  size="xl"
                  className="mx-auto mb-4"
                />
                
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h1>
                <Badge variant="primary" className="mb-3">
                  {user.role.toUpperCase()}
                </Badge>
                
                <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.location}
                </div>

                {entrepreneur && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
                      <Building className="w-4 h-4 mr-1" />
                      {entrepreneur.startup}
                    </div>
                    <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {entrepreneur.industry}
                    </div>
                    <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4 mr-1" />
                      {entrepreneur.teamSize} team members
                    </div>
                  </div>
                )}

                {investor && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
                      <Building className="w-4 h-4 mr-1" />
                      {investor.company}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">About</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {user.bio || 'No bio provided.'}
                </p>
              </CardContent>
            </Card>

            {/* Entrepreneur Specific Content */}
            {entrepreneur && (
              <>
                {/* Startup Details */}
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Startup Details</h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Funding Needed</span>
                          <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                          {formatFunding(entrepreneur.fundingNeeded)}
                        </p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Stage</span>
                          <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-1 capitalize">
                          {entrepreneur.stage}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Pitch Summary</h3>
                      <p className="text-gray-700 dark:text-gray-300">{entrepreneur.pitchSummary}</p>
                    </div>

                    {entrepreneur.website && (
                      <div>
                        <a
                          href={entrepreneur.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Visit Website
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Investor Specific Content */}
            {investor && (
              <>
                {/* Investment Details */}
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Investment Details</h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Investment Range</span>
                        <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                        {formatAmount(investor.investmentRange.min)} - {formatAmount(investor.investmentRange.max)}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Focus Industries</h3>
                      <div className="flex flex-wrap gap-2">
                        {investor.industries.map((industry, index) => (
                          <Badge key={index} variant="info">
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Portfolio Companies</h3>
                      <div className="flex flex-wrap gap-2">
                        {investor.portfolio.map((company, index) => (
                          <Badge key={index} variant="secondary">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      {investor.linkedin && (
                        <a
                          href={investor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
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
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Twitter
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Member Since */}
            <Card>
              <CardContent className="p-4">
                <div className="text-center text-gray-600 dark:text-gray-400">
                  <p className="text-sm">
                    Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};