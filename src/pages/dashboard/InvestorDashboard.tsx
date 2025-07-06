import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Users, MessageSquare, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockEntrepreneurs } from '../../data/mockData';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNavigate } from 'react-router-dom';

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  const filteredEntrepreneurs = mockEntrepreneurs.filter(entrepreneur => {
    const matchesSearch = entrepreneur.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entrepreneur.startup.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entrepreneur.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !selectedIndustry || entrepreneur.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const industries = [...new Set(mockEntrepreneurs.map(e => e.industry))];

  const handleMessage = (entrepreneurId: string) => {
    navigate(`/chat/${entrepreneurId}`);
  };

  const handleRequest = (entrepreneurId: string) => {
    console.log('Send request to entrepreneur:', entrepreneurId);
    alert('Collaboration request sent successfully!');
  };

  const stats = [
    { label: 'Total Entrepreneurs', value: '120', icon: Users, color: 'text-blue-600' },
    { label: 'Active Requests', value: '8', icon: FileText, color: 'text-purple-600' },
    { label: 'This Month', value: '12', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Messages', value: '24', icon: MessageSquare, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 dark:text-gray-300">Discover promising entrepreneurs and startups</p>
        </div>
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
              <Button variant="outline" icon={Filter}>
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Entrepreneurs Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Discover Entrepreneurs ({filteredEntrepreneurs.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntrepreneurs.map(entrepreneur => (
            <EntrepreneurCard
              key={entrepreneur.id}
              entrepreneur={entrepreneur}
              onMessage={handleMessage}
              onRequest={handleRequest}
            />
          ))}
        </div>
      </div>
    </div>
  );
};