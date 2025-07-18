import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { InvestorDashboard } from './InvestorDashboard';
import { EntrepreneurDashboard } from './EntrepreneurDashboard';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  console.log('DashboardPage user:', user); // Debug log

  return (
    <DashboardLayout>
      {user?.role === 'investor' ? <InvestorDashboard /> : <EntrepreneurDashboard />}
    </DashboardLayout>
  );
};