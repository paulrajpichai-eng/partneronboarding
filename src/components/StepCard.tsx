import React from 'react';
import { CheckCircle, Clock, AlertCircle, User, Briefcase, Settings, Shield } from 'lucide-react';
import { OnboardingStep } from '../types/onboarding';

interface StepCardProps {
  step: OnboardingStep;
  onClick: () => void;
  isActive?: boolean;
}

const StepCard: React.FC<StepCardProps> = ({ step, onClick, isActive = false }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personal': return <User className="w-5 h-5" />;
      case 'professional': return <Briefcase className="w-5 h-5" />;
      case 'system': return <Settings className="w-5 h-5" />;
      case 'compliance': return <Shield className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return 'text-blue-600 bg-blue-50';
      case 'professional': return 'text-emerald-600 bg-emerald-50';
      case 'system': return 'text-purple-600 bg-purple-50';
      case 'compliance': return 'text-amber-600 bg-amber-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
        isActive ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
      } ${step.completed ? 'bg-gradient-to-br from-green-50 to-emerald-50' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${getCategoryColor(step.category)}`}>
          {getCategoryIcon(step.category)}
        </div>
        <div className="flex items-center">
          {step.completed ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : step.required ? (
            <AlertCircle className="w-6 h-6 text-amber-500" />
          ) : (
            <Clock className="w-6 h-6 text-gray-400" />
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{step.description}</p>

      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          step.required ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {step.required ? 'Required' : 'Optional'}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          step.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {step.completed ? 'Completed' : 'Pending'}
        </span>
      </div>
    </div>
  );
};

export default StepCard;