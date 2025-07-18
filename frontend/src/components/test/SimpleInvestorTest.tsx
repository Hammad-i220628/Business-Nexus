import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '../ui/Card';

export const SimpleInvestorTest: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Simple Investor Test
          </h1>
          <div className="space-y-2">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Location:</strong> {user?.location}</p>
            <p><strong>Bio:</strong> {user?.bio}</p>
          </div>
          <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <p className="text-green-800 dark:text-green-300">
              ✅ Investor dashboard is loading successfully!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};