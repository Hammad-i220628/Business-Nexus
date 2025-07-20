import React from 'react';
import { Button } from '../ui/Button';

const defaultUserIcon = (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="5" fill="#bbb" />
    <path d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6" fill="#bbb" />
  </svg>
);

interface CompactEntrepreneurCardProps {
  entrepreneur: any;
  onMessage: (id: string) => void;
  onRequest: (id: string) => void;
}

export const CompactEntrepreneurCard: React.FC<CompactEntrepreneurCardProps> = ({ entrepreneur, onMessage, onRequest }) => (
  <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 mb-2 shadow">
    <div className="flex items-center space-x-3">
      {defaultUserIcon}
      <span className="font-medium text-gray-900 dark:text-white">{entrepreneur.name}</span>
    </div>
    <div className="flex space-x-2">
      <Button variant="outline" size="sm" onClick={() => onMessage(entrepreneur.id || entrepreneur._id || '')}>
        Message
      </Button>
      <Button variant="primary" size="sm" onClick={() => onRequest(entrepreneur.id || entrepreneur._id || '')}>
        Send Request
      </Button>
    </div>
  </div>
); 