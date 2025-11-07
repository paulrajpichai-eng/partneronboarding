import React, { useState } from 'react';
import { CheckCircle, DollarSign, Eye } from 'lucide-react';
import Header from '../common/Header';
import { PricingTask, Partner } from '../../types/partner';

interface EnrichedPricingTask extends PricingTask {
  partners: Partner;
}

interface PricingDashboardProps {
  tasks: EnrichedPricingTask[];
  onCompleteTask: (taskId: string) => void;
  onLogout: () => void;
}

const PricingDashboard: React.FC<PricingDashboardProps> = ({ 
  tasks, 
  onCompleteTask, 
  onLogout 
}) => {
  const [selectedTask, setSelectedTask] = useState<EnrichedPricingTask | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Pricing Dashboard" 
        userRole="Pricing Team"
        userName="Pricing Admin"
        onLogout={onLogout}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Margin Configuration Tasks</h2>
            <p className="text-gray-600 mt-1">Configure margin settings for approved partners</p>
          </div>

          <div className="divide-y divide-gray-200">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Tasks</h3>
                <p className="text-gray-600">All margin configurations have been completed</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900 mr-3">
                          {task.partners.firm_name}
                        </h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mr-2">
                          Partner ID: {task.partner_id}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.status === 'completed' ? 'bg-green-100 text-green-700' :
                          task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {task.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div><strong>Owner:</strong> {task.partners.owner_name}</div>
                        <div><strong>Email:</strong> {task.partners.email}</div>
                        <div><strong>Business:</strong> {task.partners.business}</div>
                        <div><strong>Country:</strong> {task.partners.country}</div>
                        <div><strong>Brand:</strong> {task.partners.brand}</div>
                        <div><strong>Brand Channel:</strong> {task.partners.brand_channel}</div>
                        <div><strong>Plan ID:</strong> {task.partners.plan_id}</div>
                      </div>

                      {task.partners.feature_rights && (
                        <div className="mb-4">
                          <strong className="text-sm text-gray-700">Feature Rights:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {task.partners.feature_rights.map(feature => (
                              <span key={feature} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {task.status === 'pending' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-sm text-yellow-800">
                            <strong>Action Required:</strong> Configure margin settings using the independent margin tool, 
                            then mark this task as complete.
                          </p>
                        </div>
                      )}

                      {task.marginConfigured && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center text-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Margin configuration completed</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {task.status === 'pending' && (
                        <button
                          onClick={() => onCompleteTask(task.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-1 inline" />
                          Complete Margin Setup
                        </button>
                      )}
                      
                      {task.status === 'completed' && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">Margin Setup Complete</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingDashboard;