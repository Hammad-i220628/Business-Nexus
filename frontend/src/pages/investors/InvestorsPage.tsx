import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { usersAPI } from '../../services/api';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const InvestorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [investors, setInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getInvestors({ limit: 100 });
      setInvestors(response.data || []);
      console.log('Fetched investors:', response.data || []);
    } catch (error) {
      setInvestors([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (investor.company || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !selectedIndustry || (investor.industries || []).includes(selectedIndustry);
    return matchesSearch && matchesIndustry;
  });

  const industries = [...new Set(investors.flatMap(inv => inv.industries || []))];

  const handleMessage = (investorId: string) => {
    navigate(`/chat/${investorId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Discover Investors</h1>
          <p className="text-gray-600 dark:text-gray-300">Connect with investors who align with your vision</p>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  icon={Search}
                  placeholder="Search investors or companies..."
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

        {/* Investors Grid */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Available Investors ({filteredInvestors.length})
          </h2>
          {loading ? (
            <div className="text-center py-8">Loading investors...</div>
          ) : filteredInvestors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No investors found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInvestors.map(investor => (
                <InvestorCard
                  key={investor._id}
                  investor={investor}
                  onMessage={handleMessage}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};