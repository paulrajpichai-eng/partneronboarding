import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { ocrService } from '../../utils/ocrService';

interface BankingDetailsFormProps {
  onNext: (data: any) => void;
  onBack: () => void;
  businessType: 'Sales' | 'Exchange';
  initialData?: any;
}

const BankingDetailsForm: React.FC<BankingDetailsFormProps> = ({ 
  onNext, 
  onBack, 
  businessType, 
  initialData 
}) => {
  const [bankingDetails, setBankingDetails] = useState({
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    chequeImageUrl: '',
    isVerified: false,
    ...initialData
  });

  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrData, setOcrData] = useState<any>(null);
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [ocrError, setOcrError] = useState<string>('');

  // Skip banking details for Sales
  if (businessType === 'Sales') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Banking Details Not Required</h2>
          <p className="text-gray-600 mb-6">
            Banking details are not required for Sales business type.
          </p>
          <div className="flex justify-between">
            <button
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => onNext({})}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleChequeUpload = async (file: File) => {
    setOcrProcessing(true);
    setOcrError('');
    try {
      // Preprocess image for better OCR results
      const preprocessedFile = await ocrService.preprocessImage(file);
      
      // Extract banking details using OCR
      const extractedData = await ocrService.extractBankingDetails(preprocessedFile);
      
      // Validate extracted data
      const validation = ocrService.validateBankingDetails(extractedData);
      
      if (!validation.isValid) {
        setOcrError(`OCR extraction issues: ${validation.errors.join(', ')}`);
      }
      
      setOcrData(extractedData);
      setBankingDetails({
        ...bankingDetails,
        accountHolderName: extractedData.accountHolderName,
        accountNumber: extractedData.accountNumber,
        bankName: extractedData.bankName,
        ifscCode: extractedData.ifscCode,
        chequeImageUrl: URL.createObjectURL(file)
      });
    } catch (error) {
      console.error('OCR processing failed:', error);
      setOcrError('Failed to extract banking details from image. Please enter details manually.');
    } finally {
      setOcrProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleChequeUpload(file);
    }
  };

  const handleConfirmDetails = () => {
    setUserConfirmed(true);
    setBankingDetails({ ...bankingDetails, isVerified: true });
  };

  const handleManualEdit = () => {
    setUserConfirmed(false);
    setBankingDetails({ ...bankingDetails, isVerified: false });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankingDetails.isVerified) {
      alert('Please verify banking details before proceeding');
      return;
    }
    onNext({ bankingDetails });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Banking Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cheque Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Cancelled Cheque *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Upload a cancelled cheque to auto-fill banking details
              </p>
              <p className="text-sm text-red-600 mb-4">
                <strong>Important:</strong> Do not write "CANCELLED" over the IFSC code, 
                Account holder name, or any other banking fields.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="cheque-upload"
              />
              <label
                htmlFor="cheque-upload"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </label>
            </div>
          </div>

          {ocrProcessing && (
            <div className="text-center py-4">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-3"></div>
                <div>
                  <p>Processing cheque image with OCR...</p>
                  <p className="text-sm text-gray-500">This may take a few moments</p>
                </div>
              </div>
            </div>
          )}

          {ocrError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-800">OCR Processing Issue</h4>
                  <p className="text-sm text-red-700 mt-1">{ocrError}</p>
                  <p className="text-sm text-red-700 mt-2">
                    Please verify the extracted details below or enter them manually.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Banking Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Holder Name *
              </label>
              <input
                type="text"
                value={bankingDetails.accountHolderName}
                onChange={(e) => setBankingDetails({ ...bankingDetails, accountHolderName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Account holder name as per bank records"
                required
                readOnly={userConfirmed}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number *
              </label>
              <input
                type="text"
                value={bankingDetails.accountNumber}
                onChange={(e) => setBankingDetails({ ...bankingDetails, accountNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter account number"
                required
                readOnly={userConfirmed}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name *
              </label>
              <input
                type="text"
                value={bankingDetails.bankName}
                onChange={(e) => setBankingDetails({ ...bankingDetails, bankName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Bank name"
                required
                readOnly={userConfirmed}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IFSC Code *
              </label>
              <input
                type="text"
                value={bankingDetails.ifscCode}
                onChange={(e) => setBankingDetails({ ...bankingDetails, ifscCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="IFSC code (e.g., HDFC0001234)"
                required
                readOnly={userConfirmed}
              />
            </div>
          </div>

          {userConfirmed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-green-800 font-medium">Banking details verified and confirmed</span>
              </div>
            </div>
          )}

          {ocrData && !userConfirmed && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                <div className="flex-1">
                  <h4 className="font-medium text-yellow-800">Verify Auto-Populated Details</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please verify if the auto-populated banking details are accurate.
                    {ocrData.rawText && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs">View extracted text</summary>
                        <pre className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-auto max-h-32">
                          {ocrData.rawText}
                        </pre>
                      </details>
                    )}
                  </p>
                  <div className="mt-3 flex space-x-3">
                    <button
                      type="button"
                      onClick={handleConfirmDetails}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      Details are Accurate
                    </button>
                    <button
                      type="button"
                      onClick={handleManualEdit}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                    >
                      Edit Manually
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Next: Review & Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankingDetailsForm;