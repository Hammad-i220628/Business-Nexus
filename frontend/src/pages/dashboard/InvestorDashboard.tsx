import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Users, MessageSquare, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usersAPI } from '../../services/api';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { CompactEntrepreneurCard } from '../../components/entrepreneur/CompactEntrepreneurCard';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNavigate } from 'react-router-dom';

interface Entrepreneur {
  _id: string;
  name: string;
  email: string;
  startup: string;
  industry: string;
  fundingNeeded: number;
  pitchSummary: string;
  avatar: string;
  location: string;
  bio: string;
  stage?: 'idea' | 'prototype' | 'mvp' | 'growth' | 'expansion';
  teamSize?: number;
  createdAt?: string;
  website?: string;
}

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [stats, setStats] = useState({
    totalEntrepreneurs: 0,
    activeRequests: 0,
    thisMonth: 0,
    messages: 0
  });

  useEffect(() => {
    fetchEntrepreneurs();
    fetchStats();
    
    // Set up auto-refresh every 30 seconds to catch new entrepreneurs
    const interval = setInterval(() => {
      fetchEntrepreneurs();
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Also refresh when search term or industry changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEntrepreneurs();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedIndustry]);

  const fetchEntrepreneurs = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getEntrepreneurs({
        search: searchTerm,
        industry: selectedIndustry,
        limit: 100
      });
      console.log('Entrepreneurs response:', response);
      // Fix: Use response.data (array of entrepreneurs)
      setEntrepreneurs(response.data || []);
    } catch (error) {
      console.error('Failed to fetch entrepreneurs:', error);
      setEntrepreneurs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await usersAPI.getDashboardStats();
      console.log('Stats response:', response);
      const statsData = response.data || response || {};
      setStats({
        totalEntrepreneurs: 0,
        activeRequests: 0,
        thisMonth: 0,
        messages: 0,
        ...statsData
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({
        totalEntrepreneurs: 0,
        activeRequests: 0,
        thisMonth: 0,
        messages: 0
      });
    }
  };

  const handleSearch = () => {
    fetchEntrepreneurs();
  };

  const handleMessage = (entrepreneurId: string) => {
    navigate(`/chat/${entrepreneurId}`);
  };

  const handleRequest = async (entrepreneurId: string) => {
    try {
      // This would be implemented with the requests API
      console.log('Send request to entrepreneur:', entrepreneurId);
      alert('Collaboration request sent successfully!');
    } catch (error) {
      console.error('Failed to send request:', error);
      alert('Failed to send request. Please try again.');
    }
  };

  const statsData = [
    { label: 'Total Entrepreneurs', value: (stats.totalEntrepreneurs ?? 0).toString(), icon: Users, color: 'text-blue-600' },
    { label: 'Active Requests', value: (stats.activeRequests ?? 0).toString(), icon: FileText, color: 'text-purple-600' },
    { label: 'This Month', value: (stats.thisMonth ?? 0).toString(), icon: TrendingUp, color: 'text-green-600' },
    { label: 'Messages', value: (stats.messages ?? 0).toString(), icon: MessageSquare, color: 'text-orange-600' }
  ];

  const industries = [...new Set(entrepreneurs.map(e => e.industry))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 dark:text-gray-300">Discover promising entrepreneurs and startups</p>
        </div>
        <Button variant="outline" onClick={fetchEntrepreneurs}>
          Refresh
        </Button>
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
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                icon={Search}
                placeholder="Search entrepreneurs, startups, or industries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
              <Button variant="outline" icon={Filter} onClick={handleSearch}>
                Search
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Entrepreneurs List (Compact) */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Available Entrepreneurs ({entrepreneurs.length})
        </h2>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : entrepreneurs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No entrepreneurs found matching your criteria.</p>
          </div>
        ) : (
          <div>
            {entrepreneurs.map(entrepreneur => (
              <CompactEntrepreneurCard
                key={entrepreneur._id}
                entrepreneur={entrepreneur}
                onMessage={handleMessage}
                onRequest={handleRequest}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};