import React, { useState } from 'react';
import { useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { usersAPI } from '../../services/api';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
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

export const EntrepreneursPage: React.FC = () => {
  const navigate = useNavigate();
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  useEffect(() => {
    fetchEntrepreneurs();
  }, []);

  const fetchEntrepreneurs = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getEntrepreneurs({
        search: searchTerm,
        industry: selectedIndustry,
        limit: 100
      });
      console.log('Entrepreneurs response:', response);
      const entrepreneursData = response.data || response || [];
      setEntrepreneurs(entrepreneursData);
    } catch (error) {
      console.error('Failed to fetch entrepreneurs:', error);
      setEntrepreneurs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    const matchesSearch = entrepreneur.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entrepreneur.startup.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entrepreneur.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !selectedIndustry || entrepreneur.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const industries = [...new Set(entrepreneurs.map(e => e.industry))];

  const handleSearch = () => {
    fetchEntrepreneurs();
  };

  const handleMessage = (entrepreneurId: string) => {
    navigate(`/chat/${entrepreneurId}`);
  };

  const handleRequest = (entrepreneurId: string) => {
    console.log('Send request to entrepreneur:', entrepreneurId);
    alert('Collaboration request sent successfully!');
  };

  return (
    <DashboardLayout onRefresh={fetchEntrepreneurs}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Discover Entrepreneurs</h1>
          <p className="text-gray-600 dark:text-gray-300">Find promising startups and innovative founders</p>
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

        {/* Entrepreneurs Grid */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Available Entrepreneurs ({filteredEntrepreneurs.length})
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredEntrepreneurs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No entrepreneurs found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntrepreneurs.map(entrepreneur => (
                <EntrepreneurCard
                  key={entrepreneur._id}
                  entrepreneur={{
                    id: entrepreneur._id,
                    name: entrepreneur.name || 'No Name',
                    email: entrepreneur.email || 'No Email',
                    role: 'entrepreneur',
                    startup: entrepreneur.startup || '',
                    industry: entrepreneur.industry || '',
                    fundingNeeded: entrepreneur.fundingNeeded ?? 0,
                    pitchSummary: entrepreneur.pitchSummary || '',
                    avatar: entrepreneur.avatar || '',
                    location: entrepreneur.location || '',
                    bio: entrepreneur.bio || '',
                    stage: entrepreneur.stage || 'idea',
                    teamSize: entrepreneur.teamSize ?? 1,
                    createdAt: entrepreneur.createdAt || new Date().toISOString(),
                    website: entrepreneur.website || ''
                  }}
                  onMessage={() => handleMessage(entrepreneur._id)}
                  onRequest={() => handleRequest(entrepreneur._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};