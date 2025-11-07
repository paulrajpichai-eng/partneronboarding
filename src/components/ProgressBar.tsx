import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  total: number;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, showPercentage = true }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Progress: {current} of {total} completed
        </span>
        {showPercentage && (
          <span className="text-sm font-medium text-indigo-600">{percentage}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
        </div>
      </div>
      {percentage === 100 && (
        <div className="flex items-center mt-2 text-green-600">
          <CheckCircle className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">Onboarding Complete!</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;