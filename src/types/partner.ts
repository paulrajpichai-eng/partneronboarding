import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ReviewSubmitFormProps {
  onSubmit: () => void;
  onBack: () => void;
  formData: any;
}

const ReviewSubmitForm: React.FC<ReviewSubmitFormProps> = ({ onSubmit, onBack, formData }) => {
  const [consentGiven, setConsentGiven] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) {
      alert('Please provide consent to proceed');
      return;
    }
    onSubmit();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Submit</h2>
        
        <div className="space-y-6">
          {/* Company Details Review */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>Owner Name:</strong> {formData.ownerName}</div>
              <div><strong>Firm Name:</strong> {formData.firmName}</div>
              <div><strong>Email:</strong> {formData.email}</div>
              <div><strong>Mobile:</strong> {formData.mobile}</div>
              <div><strong>Country:</strong> {formData.country}</div>
              <div><strong>Brand:</strong> {formData.brand}</div>
              <div><strong>Business Type:</strong> {formData.business}</div>
              <div><strong>SPOC ID:</strong> {formData.uncodedSpocId}</div>
              <div><strong>{formData.taxIdType}:</strong> {formData.taxId}</div>
              <div><strong>Payment Modes:</strong> {formData.paymentModes?.join(', ')}</div>
              <div><strong>Invoicing:</strong> {formData.invoicingFrequency} - {formData.invoicingType}</div>
            </div>
          </div>

          {/* Address Review */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Details</h3>
            <div className="text-sm">
              <p>{formData.address}</p>
              <p>{formData.city}, {formData.state} - {formData.pinCode}</p>
              {formData.landmark && <p>Landmark: {formData.landmark}</p>}
              }
            </div>
          </div>

          {/* Banking Details Review (if B2C) */}
          {formData.business === 'B2C' && formData.bankingDetails && (
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
                <p className="text-sm text-yellow-700 mb-4">
                  I hereby allow Uncoded to use details provided above for the purpose of 
                  partner creation and enabling business with Uncoded.
                </p>
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