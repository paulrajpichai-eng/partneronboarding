import React, { useState } from 'react';
import { CheckCircle, Clock, MessageSquare, Eye } from 'lucide-react';
import Header from '../common/Header';
import { BOSTask, Partner } from '../../types/partner';

interface EnrichedBOSTask extends BOSTask {
  partners: Partner;
}

interface BOSDashboardProps {
  tasks: EnrichedBOSTask[];
  onCompleteTask: (taskId: string, planId: string, featureRights: string[]) => void;
  onRequestInfo: (taskId: string, message: string) => void;
  onLogout: () => void;
}

const BOSDashboard: React.FC<BOSDashboardProps> = ({ 
  tasks, 
  onCompleteTask, 
  onRequestInfo, 
  onLogout 
}) => {
  // Create separate state for each task to avoid cross-contamination
  const [taskStates, setTaskStates] = useState<Record<string, {
    planIds: string[];
    featureRights: string[];
  }>>({});
  const [requestMessage, setRequestMessage] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedTaskForRequest, setSelectedTaskForRequest] = useState<EnrichedBOSTask | null>(null);

  const availableFeatures = [
    'Dashboard Access',
    'Reporting',
    'Analytics',
    'API Access',
    'Multi-location',
    'Custom Branding',
    'Priority Support'
  ];

  const availablePlans = ['111', '123', '457', '789', '999'];

  // Initialize task state if not exists
  const getTaskState = (taskId: string) => {
    if (!taskStates[taskId]) {
      setTaskStates(prev => ({
        ...prev,
        [taskId]: { planIds: [], featureRights: [] }
      }));
      return { planIds: [], featureRights: [] };
    }
    return taskStates[taskId];
  };

  // Update task state
  const updateTaskState = (taskId: string, updates: Partial<{ planIds: string[]; featureRights: string[] }>) => {
    setTaskStates(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], ...updates }
    }));
  };

  const handleCompleteTask = (task: EnrichedBOSTask) => {
    const taskState = getTaskState(task.id);
    if (taskState.planIds.length === 0 || taskState.featureRights.length === 0) {
      alert('Please select plan IDs and feature rights');
      return;
    }
    
    // Join multiple plan IDs with comma
    const planIdString = taskState.planIds.join(',');
    onCompleteTask(task.id, planIdString, taskState.featureRights);
    
    // Clear task state
    setTaskStates(prev => {
      const newState = { ...prev };
      delete newState[task.id];
      return newState;
    });
  };

  const handleRequestInfo = (task: EnrichedBOSTask) => {
    if (!requestMessage.trim()) {
      alert('Please enter a message');
      return;
    }
    onRequestInfo(task.id, requestMessage);
    setShowRequestModal(false);
    setRequestMessage('');
    setSelectedTaskForRequest(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="BOS Dashboard" 
        userRole="BOS User"
        userName="BOS Admin"
        onLogout={onLogout}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Partner Registration Tasks</h2>
            <p className="text-gray-600 mt-1">Review and process partner registrations</p>
          </div>

          <div className="divide-y divide-gray-200">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Tasks</h3>
                <p className="text-gray-600">All partner registrations have been processed</p>
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
                        <div><strong>Brand Channel:</strong> {task.partners.brand_channel || 'Pending'}</div>
                      </div>

                      {task.status === 'pending' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Plan IDs * (Multiple Selection)
                              </label>
                              <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                                {availablePlans.map(plan => {
                                  const taskState = getTaskState(task.id);
                                  return (
                                    <label key={plan} className="flex items-center text-sm">
                                      <input
                                        type="checkbox"
                                        checked={taskState.planIds.includes(plan)}
                                        onChange={(e) => {
                                          const currentPlanIds = taskState.planIds;
                                          if (e.target.checked) {
                                            updateTaskState(task.id, { 
                                              planIds: [...currentPlanIds, plan] 
                                            });
                                          } else {
                                            updateTaskState(task.id, { 
                                              planIds: currentPlanIds.filter(p => p !== plan) 
                                            });
                                          }
                                        }}
                                        className="mr-2"
                                      />
                                      {plan}
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Feature Rights *
                              </label>
                              <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                                {availableFeatures.map(feature => {
                                  const taskState = getTaskState(task.id);
                                  return (
                                    <label key={feature} className="flex items-center text-sm">
                                      <input
                                        type="checkbox"
                                        checked={taskState.featureRights.includes(feature)}
                                        onChange={(e) => {
                                          const currentFeatureRights = taskState.featureRights;
                                          if (e.target.checked) {
                                            updateTaskState(task.id, { 
                                              featureRights: [...currentFeatureRights, feature] 
                                            });
                                          } else {
                                            updateTaskState(task.id, { 
                                              featureRights: currentFeatureRights.filter(f => f !== feature) 
                                            });
                                          }
                                        }}
                                        className="mr-2"
                                      />
                                      {feature}
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {task.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedTaskForRequest(task);
                              setShowRequestModal(true);
                            }}
                            className="px-3 py-1 text-sm border border-yellow-300 text-yellow-700 rounded hover:bg-yellow-50 transition-colors"
                          >
                            <MessageSquare className="w-4 h-4 mr-1 inline" />
                            Request Info
                          </button>
                          
                          <button
                            onClick={() => handleCompleteTask(task)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 mr-1 inline" />
                            Complete
                          </button>
                        </>
                      )}
                      
                      {task.status === 'completed' && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Request Info Modal */}
        {showRequestModal && selectedTaskForRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Request Additional Information
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Send a message to {selectedTaskForRequest.partners.firm_name} requesting additional information.
                </p>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your message..."
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => {
                      setShowRequestModal(false);
                      setRequestMessage('');
                      setSelectedTaskForRequest(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRequestInfo(selectedTaskForRequest)}
                    className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BOSDashboard;