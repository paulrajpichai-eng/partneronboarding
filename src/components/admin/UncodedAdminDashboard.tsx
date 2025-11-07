import React, { useState } from 'react';
import { BarChart3, Upload, Users, Clock, TrendingUp, Download } from 'lucide-react';
import Header from '../common/Header';
import { AdminAnalytics, SpocMapping, BrandChannelMapping } from '../../types/partner';

interface UncodedAdminDashboardProps {
  analytics: any;
  spocMappings: SpocMapping[];
  brandChannelMappings: BrandChannelMapping[];
  onUploadSpocMapping: (file: File) => void;
  onUploadBrandChannelMapping: (file: File) => void;
  onDeleteSpocMapping: (id: string) => void;
  onDeleteBrandChannelMapping: (id: string) => void;
  onLogout: () => void;
}

const UncodedAdminDashboard: React.FC<UncodedAdminDashboardProps> = ({
  analytics,
  spocMappings,
  brandChannelMappings,
  onUploadSpocMapping,
  onUploadBrandChannelMapping,
  onDeleteSpocMapping,
  onDeleteBrandChannelMapping,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'market-mapping'>('home');

  const downloadTemplate = (type: 'spoc' | 'brand-channel') => {
    let csvContent = '';
    let filename = '';
    
    if (type === 'spoc') {
      csvContent = 'SPOC ID,Name,Email ID\nSPOC001,John Doe,john@uncoded.com\nSPOC002,Jane Smith,jane@uncoded.com';
      filename = 'spoc_mapping_template.csv';
    } else {
      csvContent = 'Numeric Value,Brand Channel\n1,Enterprise Direct\n2,SMB Partner\n3,Retail Channel';
      filename = 'brand_channel_mapping_template.csv';
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Admin Dashboard" 
        userRole="Uncoded Admin"
        userName="Admin User"
        onLogout={onLogout}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'home', label: 'Home', icon: BarChart3 },
                { id: 'market-mapping', label: 'Market Mapping', icon: Upload }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'home' && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Total Partners</p>
                        <p className="text-3xl font-bold">{analytics.totalPartners}</p>
                      </div>
                      <Users className="w-8 h-8 text-purple-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Completed Onboardings</p>
                        <p className="text-3xl font-bold">{analytics.completedOnboardings}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Avg. Duration (days)</p>
                        <p className="text-3xl font-bold">{analytics.averageOnboardingDuration}</p>
                      </div>
                      <Clock className="w-8 h-8 text-blue-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100">Conversion Rate</p>
                        <p className="text-3xl font-bold">{analytics.conversionRate}%</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-yellow-200" />
                    </div>
                  </div>
                </div>

                {/* Support Usage */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Metrics</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{analytics.supportButtonUsage}</p>
                      <p className="text-gray-600">Total Support Requests</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Average response time</p>
                      <p className="text-lg font-medium text-gray-900">2.4 hours</p>
                    </div>
                  </div>
                </div>

                {/* Milestone Analytics */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Milestone Duration Analytics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-purple-600">1</span>
                      </div>
                      <h4 className="font-medium text-gray-900">Registration Process</h4>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {analytics.milestoneAnalytics.registration.average} min
                      </p>
                      <p className="text-sm text-gray-600">
                        {analytics.milestoneAnalytics.registration.count} completed
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-yellow-600">2</span>
                      </div>
                      <h4 className="font-medium text-gray-900">In Review</h4>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {analytics.milestoneAnalytics.review.average} min
                      </p>
                      <p className="text-sm text-gray-600">
                        {analytics.milestoneAnalytics.review.count} completed
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-green-600">3</span>
                      </div>
                      <h4 className="font-medium text-gray-900">User Creation</h4>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {analytics.milestoneAnalytics.userCreation.average} min
                      </p>
                      <p className="text-sm text-gray-600">
                        {analytics.milestoneAnalytics.userCreation.count} completed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'market-mapping' && (
              <div className="space-y-8">
                {/* Brand Channel Mapping */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Channel Mapping</h3>
                  <p className="text-gray-600 mb-6">
                    Upload numeric value to brand channel mappings for email responses
                  </p>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <button
                      onClick={() => downloadTemplate('brand-channel')}
                      className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Template
                    </button>
                    
                    <label className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Mapping
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => e.target.files?.[0] && onUploadBrandChannelMapping(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Numeric Value
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Brand Channel
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {brandChannelMappings.map((mapping) => (
                          <tr key={mapping.numericValue}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {mapping.numeric_value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {mapping.brand_channel}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => onDeleteBrandChannelMapping(mapping.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SPOC ID Mapping */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">SPOC ID Mapping</h3>
                  <p className="text-gray-600 mb-6">
                    Upload SPOC ID to name and email mappings for partner notifications
                  </p>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <button
                      onClick={() => downloadTemplate('spoc')}
                      className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Template
                    </button>
                    
                    <label className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Mapping
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => e.target.files?.[0] && onUploadSpocMapping(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            SPOC ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email ID
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {spocMappings.map((mapping) => (
                          <tr key={mapping.spoc_id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {mapping.spoc_id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {mapping.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {mapping.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => onDeleteSpocMapping(mapping.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UncodedAdminDashboard;