import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Milestone } from '../../types/partner';

interface ProgressJourneyProps {
  milestones: Milestone[];
}

const ProgressJourney: React.FC<ProgressJourneyProps> = ({ milestones }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <div className="w-6 h-6 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Onboarding Journey</h3>
      
      <div className="relative">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="flex items-start mb-8 last:mb-0">
            <div className="flex flex-col items-center mr-4">
              {getStatusIcon(milestone.status)}
              {index < milestones.length - 1 && (
                <div className={`w-0.5 h-12 mt-2 ${getStatusColor(milestone.status)}`} />
              )}
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{milestone.name}</h4>
              <p className="text-sm text-gray-600 capitalize">{milestone.status.replace('-', ' ')}</p>
              
              {milestone.duration && (
                <p className="text-xs text-gray-500 mt-1">
                  Duration: {milestone.duration} minutes
                </p>
              )}
              
              {milestone.notes && (
                <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                  {milestone.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressJourney;