import React, { useState } from 'react';
import { Home, MapPin, Users, FileText, BarChart3, HelpCircle } from 'lucide-react';
import Header from '../common/Header';
import ProgressJourney from '../common/ProgressJourney';
import { PartnerService } from '../../services/partnerService';
import { Partner } from '../../types/partner';

interface PartnerDashboardProps {
  partner: Partner;
  onLogout: () => void;
}

const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ partner, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'locations' | 'users' | 'reports' | 'documents'>('home');
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: '',
    brand_location_code: '',
    address: '',
    city: '',
    state: '',
    pin_code: '',
    tax_id: '',
    landmark: ''
  });
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    mobile: '',
    location_id: ''
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  const canCreateUsers = partner.status === 'user-creation' || partner.status === 'completed';
  const canManageLocations = partner.status === 'user-creation' || partner.status === 'completed';

  const handleAddLocation = async () => {
    try {
      await PartnerService.createLocation(partner.id, newLocation);
      setNewLocation({
        name: '',
        brand_location_code: '',
        address: '',
        city: '',
        state: '',
        pin_code: '',
        tax_id: '',
        landmark: ''
      });
      setShowAddLocationModal(false);
      // Refresh partner data would go here
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      await PartnerService.createUser({
        partner_id: partner.id,
        location_id: newUser.location_id,
        username: newUser.username,
        email: newUser.email,
        mobile: newUser.mobile
      });
      
      // Complete User Creation milestone and activate "You're now Live"
      await PartnerService.completeUserCreation(partner.id);
      
      alert('User created successfully!');
      
      setNewUser({
        username: '',
        email: '',
        mobile: '',
        location_id: ''
      });
      setShowAddUserModal(false);
      
      // Reload the entire app data to reflect milestone changes
      window.location.reload();
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error creating user. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Partner Portal" 
        userRole="Partner Admin"
        userName={partner.ownerName}
        onLogout={onLogout}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
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
                {/* Registration Status */}
                <ProgressJourney milestones={partner.milestones} />
                
                {/* Profile Details (shown after step 15) */}
                {canCreateUsers && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                        <p className="text-gray-900">{partner.ownerName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Firm Name</label>
                        <p className="text-gray-900">{partner.firmName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-gray-900">{partner.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile</label>
                        <p className="text-gray-900">{partner.mobile}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Contact Support */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
                      <p className="text-gray-600">Contact our support team for assistance</p>
                    </div>
                    <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'locations' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Locations</h3>
                  {canManageLocations && (
                    <div className="space-x-2">
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        Add Location
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Bulk Upload
                      </button>
                    </div>
                  )}
                </div>
                
                {!canManageLocations && (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Location Management Not Available</h4>
                    <p className="text-gray-600">
                      Location management will be enabled once your registration is fully processed.
                    </p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Current Status:</strong> {partner.status.replace('-', ' ').toUpperCase()}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        Please wait for the pricing team to complete margin configuration.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partner.locations.map((location) => (
                    <div key={location.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{location.name}</h4>
                        {location.isHeadOffice && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            Head Office
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                      <p className="text-sm text-gray-600">{location.city}, {location.state}</p>
                      <p className="text-xs text-gray-500 mt-2">ID: {location.id}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Users</h3>
                  {canCreateUsers && (
                    <div className={`space-x-2 ${!canCreateUsers ? 'opacity-50 pointer-events-none' : ''}`}>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        onClick={() => setShowAddUserModal(true)}
                        Add User
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Bulk Upload
                      </button>
                    </div>
                  )}
                </div>
                
                {!canCreateUsers ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">User Creation Not Available</h4>
                    <p className="text-gray-600">
                      User creation will be enabled once your registration is approved and processed.
                    </p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Current Status:</strong> {partner.status.replace('-', ' ').toUpperCase()}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        {partner.status === 'registration' && 'Waiting for initial review and brand channel selection.'}
                        {partner.status === 'bos-processing' && 'BOS team is processing your application.'}
                        {partner.status === 'pricing-setup' && 'Pricing team is configuring margins.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {partner.locations.map((location) => (
                      <div key={location.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900">{location.name}</h4>
                            <p className="text-sm text-gray-600">Location ID: {location.id}</p>
                          </div>
                          <button 
                            onClick={() => {
                              setNewUser({ ...newUser, location_id: location.id });
                              setShowAddUserModal(true);
                            }}
                            className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors">
                            Add User
                          </button>
                        </div>
                        
                        {partner.users.filter(user => user.locationId === location.id).length === 0 ? (
                          <div className="space-y-2">
                            {(partner.users || [])
                              .filter(user => user.location_id === location.id)
                              .map(user => (
                                <div key={user.id} className="flex items-center justify-between bg-white p-3 rounded">
                                  <div>
                                    <p className="font-medium text-gray-900">{user.username}</p>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                    <p className="text-xs text-gray-500">{user.mobile}</p>
                                  </div>
                                  <button className="text-purple-600 hover:text-purple-700 text-sm">
                                    Edit
                                  </button>
                                </div>
                              ))}
                            {(partner.users || []).filter(user => user.location_id === location.id).length === 0 && (
                              <p className="text-sm text-gray-500">No users assigned to this location</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Users will be displayed here</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Reports</h4>
                <p className="text-gray-600">Available reports will be displayed here</p>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Documents</h4>
                <p className="text-gray-600">Available documents will be displayed here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Location Modal */}
      {showAddLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Location</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Name *</label>
                  <input
                    type="text"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Branch Office, Store 1, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Location Code *</label>
                  <input
                    type="text"
                    value={newLocation.brand_location_code}
                    onChange={(e) => setNewLocation({ ...newLocation, brand_location_code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="APL-NYC-002"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea
                  value={newLocation.address}
                  onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Complete address"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    value={newLocation.city}
                    onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    value={newLocation.state}
                    onChange={(e) => setNewLocation({ ...newLocation, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    value={newLocation.pin_code}
                    onChange={(e) => setNewLocation({ ...newLocation, pin_code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID *</label>
                  <input
                    type="text"
                    value={newLocation.tax_id}
                    onChange={(e) => setNewLocation({ ...newLocation, tax_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                <input
                  type="text"
                  value={newLocation.landmark}
                  onChange={(e) => setNewLocation({ ...newLocation, landmark: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Near landmark"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddLocationModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLocation}
                disabled={!newLocation.name || !newLocation.address || !newLocation.city || !newLocation.state || !newLocation.pin_code || !newLocation.tax_id || !newLocation.brand_location_code}
                className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
              >
                Add Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
              <p className="text-sm text-gray-600 mt-1">
                User will inherit plan: <span className="font-medium text-purple-600">{partner.plan_id}</span>
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="john.doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
                <input
                  type="tel"
                  value={newUser.mobile}
                  onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="+91-9876543210"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <select
                  value={newUser.location_id}
                  onChange={(e) => setNewUser({ ...newUser, location_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Location</option>
                  {partner.locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name} - {location.city}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-900 mb-2">Inherited Features:</h4>
                <div className="space-y-1">
                  <p className="text-sm text-blue-800">
                    <strong>Plan ID:</strong> {partner.plan_id}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {partner.feature_rights?.map(feature => (
                      <span key={feature} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={!newUser.username || !newUser.email || !newUser.mobile || !newUser.location_id}
                className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerDashboard;