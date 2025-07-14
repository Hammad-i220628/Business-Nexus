import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { mockEntrepreneurs } from '../../data/mockData';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const EntrepreneursPage: React.FC = () => {
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

  return (
    <DashboardLayout>
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
            Available Entrepreneurs ({filteredEntrepreneurs.length})
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
    </DashboardLayout>
  );
};