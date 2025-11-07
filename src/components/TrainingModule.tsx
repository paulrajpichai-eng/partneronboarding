import React from 'react';
import { Play, CheckCircle, Clock, Calendar, BookOpen, Shield, Wrench, Users } from 'lucide-react';
import { Training } from '../types/onboarding';

interface TrainingModuleProps {
  trainings: Training[];
  onStartTraining: (trainingId: string) => void;
}

const TrainingModule: React.FC<TrainingModuleProps> = ({ trainings, onStartTraining }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safety': return <Shield className="w-5 h-5" />;
      case 'compliance': return <BookOpen className="w-5 h-5" />;
      case 'technical': return <Wrench className="w-5 h-5" />;
      case 'orientation': return <Users className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'safety': return 'text-red-600 bg-red-50 border-red-200';
      case 'compliance': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'technical': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'orientation': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Training Modules</h3>
        <p className="text-gray-600">Complete these training modules to ensure you're prepared for your role.</p>
      </div>

      {trainings.map((training) => {
        const daysUntilDue = getDaysUntilDue(training.dueDate);
        const overdue = isOverdue(training.dueDate);

        return (
          <div
            key={training.id}
            className={`bg-white rounded-xl shadow-sm border p-6 transition-all duration-200 hover:shadow-md ${
              training.completed ? 'border-green-200 bg-green-50' : 
              overdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg border ${getCategoryColor(training.category)}`}>
                  {getCategoryIcon(training.category)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{training.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{training.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {training.duration}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Due: {new Date(training.dueDate).toLocaleDateString()}
                    </div>
                    {training.required && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                        Required
                      </span>
                    )}
                  </div>

                  {!training.completed && (
                    <div className={`mt-2 text-sm font-medium ${
                      overdue ? 'text-red-600' : daysUntilDue <= 3 ? 'text-amber-600' : 'text-gray-600'
                    }`}>
                      {overdue ? 'Overdue!' : daysUntilDue <= 0 ? 'Due today' : `${daysUntilDue} days remaining`}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {training.completed ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-1" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onStartTraining(training.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                      overdue ? 'bg-red-600 hover:bg-red-700 text-white' :
                      'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Training
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrainingModule;