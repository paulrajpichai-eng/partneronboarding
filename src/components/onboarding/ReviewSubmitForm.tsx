import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Edit } from 'lucide-react';

interface ReviewSubmitFormProps {
  onSubmit: () => void;
  onBack: () => void;
  formData: any;
}

const ReviewSubmitForm: React.FC<ReviewSubmitFormProps> = ({ onSubmit, onBack, formData }) => {
  const [consentGiven, setConsentGiven] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editableData, setEditableData] = useState(formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) {
      alert('Please provide consent to proceed');
      return;
    }
    // Update formData with editableData before submitting
    Object.assign(formData, editableData);
    onSubmit();
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    setEditMode(false);
    // Update formData with editableData
    Object.assign(formData, editableData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
          <button
            onClick={editMode ? handleSaveEdit : handleEdit}
            className="flex items-center px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            {editMode ? 'Save Changes' : 'Edit Details'}
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Company Details Review */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Owner Name:</strong> 
                {editMode ? (
                  <input
                    type="text"
                    value={editableData.ownerName}
                    onChange={(e) => setEditableData({ ...editableData, ownerName: e.target.value })}
                    className="ml-2 px-2 py-1 border rounded"
                  />
                ) : (
                  <span className="ml-2">{formData.ownerName}</span>
                )}
              </div>
              <div>
                <strong>Firm Name:</strong> 
                {editMode ? (
                  <input
                    type="text"
                    value={editableData.firmName}
                    onChange={(e) => setEditableData({ ...editableData, firmName: e.target.value })}
                    className="ml-2 px-2 py-1 border rounded"
                  />
                ) : (
                  <span className="ml-2">{formData.firmName}</span>
                )}
              </div>
              <div><strong>Email:</strong> {formData.email}</div>
              <div><strong>Mobile:</strong> {formData.mobile}</div>
              <div>
                <strong>Country:</strong> 
                {editMode ? (
                  <select
                    value={editableData.country}
                    onChange={(e) => setEditableData({ ...editableData, country: e.target.value })}
                    className="ml-2 px-2 py-1 border rounded"
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UAE">UAE</option>
                    <option value="UK">UK</option>
                  </select>
                ) : (
                  <span className="ml-2">{formData.country}</span>
                )}
              </div>
              <div>
                <strong>Brand:</strong> 
                {editMode ? (
                  <select
                    value={editableData.brand}
                    onChange={(e) => setEditableData({ ...editableData, brand: e.target.value })}
                    className="ml-2 px-2 py-1 border rounded"
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Vivo">Vivo</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Oppo">Oppo</option>
                  </select>
                ) : (
                  <span className="ml-2">{formData.brand}</span>
                )}
              </div>
              <div>
                <strong>Business Type:</strong> 
                {editMode ? (
                  <select
                    value={editableData.business}
                    onChange={(e) => setEditableData({ ...editableData, business: e.target.value })}
                    className="ml-2 px-2 py-1 border rounded"
                  >
                    <option value="Sales">Sales</option>
                    <option value="Exchange">Exchange</option>
                  </select>
                ) : (
                  <span className="ml-2">{formData.business}</span>
                )}
              </div>
              <div><strong>SPOC ID:</strong> {formData.uncodedSpocId}</div>
              <div><strong>{formData.taxIdType}:</strong> {formData.taxId}</div>
              <div>
                <strong>Payment Modes:</strong> 
                {editMode ? (
                  <div className="ml-2 space-y-1">
                    {['Insta-pay', 'PAYG'].map(mode => (
                      <label key={mode} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editableData.paymentModes?.includes(mode)}
                          onChange={(e) => {
                            const modes = editableData.paymentModes || [];
                            if (e.target.checked) {
                              setEditableData({ ...editableData, paymentModes: [...modes, mode] });
                            } else {
                              setEditableData({ ...editableData, paymentModes: modes.filter(m => m !== mode) });
                            }
                          }}
                          className="mr-1"
                        />
                        <span className="text-xs">{mode}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <span className="ml-2">{formData.paymentModes?.join(', ')}</span>
                )}
              </div>
              <div>
                <strong>Invoicing:</strong> 
                {editMode ? (
                  <div className="ml-2">
                    <select
                      value={editableData.invoicingFrequency}
                      onChange={(e) => setEditableData({ ...editableData, invoicingFrequency: e.target.value })}
                      className="px-1 py-1 border rounded text-xs mr-1"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <select
                      value={editableData.invoicingType}
                      onChange={(e) => setEditableData({ ...editableData, invoicingType: e.target.value })}
                      className="px-1 py-1 border rounded text-xs"
                    >
                      <option value="consolidated">Consolidated</option>
                      <option value="statewise">Statewise</option>
                      <option value="storewise">Storewise</option>
                    </select>
                  </div>
                ) : (
                  <span className="ml-2">{formData.invoicingFrequency} - {formData.invoicingType}</span>
                )}
              </div>
            </div>
          </div>

          {/* Address Review */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Details</h3>
            {editMode ? (
              <div className="space-y-3">
                <div>
                  <strong className="text-sm">Address:</strong>
                  <textarea
                    value={editableData.address}
                    onChange={(e) => setEditableData({ ...editableData, address: e.target.value })}
                    className="w-full mt-1 px-2 py-1 border rounded text-sm"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <strong className="text-sm">City:</strong>
                    <input
                      type="text"
                      value={editableData.city}
                      onChange={(e) => setEditableData({ ...editableData, city: e.target.value })}
                      className="w-full mt-1 px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <strong className="text-sm">State:</strong>
                    <input
                      type="text"
                      value={editableData.state}
                      onChange={(e) => setEditableData({ ...editableData, state: e.target.value })}
                      className="w-full mt-1 px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <strong className="text-sm">PIN Code:</strong>
                    <input
                      type="text"
                      value={editableData.pinCode}
                      onChange={(e) => setEditableData({ ...editableData, pinCode: e.target.value })}
                      className="w-full mt-1 px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <strong className="text-sm">Landmark:</strong>
                    <input
                      type="text"
                      value={editableData.landmark || ''}
                      onChange={(e) => setEditableData({ ...editableData, landmark: e.target.value })}
                      className="w-full mt-1 px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>
                <div>
                  <strong className="text-sm">Brand Location Code:</strong>
                  <input
                    type="text"
                    value={editableData.brandLocationCode}
                    onChange={(e) => setEditableData({ ...editableData, brandLocationCode: e.target.value })}
                    className="w-full mt-1 px-2 py-1 border rounded text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="text-sm">
                <p>{formData.address}</p>
                <p>{formData.city}, {formData.state} - {formData.pinCode}</p>
                {formData.landmark && <p>Landmark: {formData.landmark}</p>}
                <p>Brand Location Code: {formData.brandLocationCode}</p>
              </div>
            )}
          </div>

          {/* Banking Details Review (if Exchange) */}
          {formData.business === 'Exchange' && formData.bankingDetails && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Banking Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Account Holder:</strong> {formData.bankingDetails.accountHolderName}</div>
                <div><strong>Account Number:</strong> {formData.bankingDetails.accountNumber}</div>
                <div><strong>Bank Name:</strong> {formData.bankingDetails.bankName}</div>
                <div><strong>IFSC Code:</strong> {formData.bankingDetails.ifscCode}</div>
              </div>
              {formData.bankingDetails.isVerified && (
                <div className="flex items-center mt-2 text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">Banking details verified</span>
                </div>
              )}
            </div>
          )}

          {/* Disclaimer and Consent */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-800 mb-2">Disclaimer</h4>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-1 mr-3"
                    required
                  />
                  <span className="text-sm text-yellow-800">
                    I agree to the above terms and provide my consent for Uncoded to use 
                    the provided information for partner onboarding and business operations.
                  </span>
                </label>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!consentGiven}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmitForm;