import React, { useState, useEffect } from 'react';
import { Building, Mail, Phone, MapPin, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { validateEmail, validateMobile, validateTaxId, validateGSTIN, getTaxIdType } from '../../utils/validation';
import { AdminService } from '../../services/adminService';

interface CompanyDetailsFormProps {
  onNext: (data: any) => void;
  initialData?: any;
  authenticatedUser?: any;
}

const CompanyDetailsForm: React.FC<CompanyDetailsFormProps> = ({ onNext, initialData, authenticatedUser }) => {
  const [formData, setFormData] = useState({
    ownerName: authenticatedUser ? `${authenticatedUser.firstName} ${authenticatedUser.lastName}` : '',
    firmName: '',
    email: authenticatedUser?.email || '',
    mobile: '',
    country: 'India',
    brand: '',
    business: 'Sales',
    uncodedSpocId: '',
    address: '',
    city: '',
    pinCode: '',
    landmark: '',
    state: '',
    taxId: '',
    gstin: '',
    brandLocationCode: '',
    paymentModes: [],
    paymentModeDetails: {},
    invoicingFrequency: 'monthly',
    invoicingType: 'consolidated',
    ...initialData
  });

  const [validations, setValidations] = useState({
    email: { isValid: false, message: '' },
    mobile: { isValid: false, message: '' },
    taxId: { isValid: false, message: '' },
    gstin: { isValid: false, message: '' }
  });

  const [spocValidation, setSpocValidation] = useState({
    isValid: false,
    spocName: '',
    message: ''
  });

  const [otpStates, setOtpStates] = useState({
    email: {
      sent: false,
      verified: false,
      otp: ''
    },
    mobile: {
      sent: false,
      verified: false,
      otp: ''
    }
  });

  const [loading, setLoading] = useState({
    email: false,
    mobile: false,
    taxId: false,
    gstin: false,
    spoc: false
  });

  const taxIdType = getTaxIdType(formData.country);

  const handleSendEmailOTP = () => {
    setOtpStates(prev => ({
      ...prev,
      email: { ...prev.email, sent: true }
    }));
  };

  const handleSendMobileOTP = () => {
    setOtpStates(prev => ({
      ...prev,
      mobile: { ...prev.mobile, sent: true }
    }));
  };

  const handleVerifyEmailOTP = () => {
    if (otpStates.email.otp.length === 6) {
      setOtpStates(prev => ({
        ...prev,
        email: { ...prev.email, verified: true }
      }));
    }
  };

  const handleVerifyMobileOTP = () => {
    if (otpStates.mobile.otp.length === 6) {
      setOtpStates(prev => ({
        ...prev,
        mobile: { ...prev.mobile, verified: true }
      }));
    }
  };

  const handleValidateEmail = async () => {
    if (!formData.email) return;
    
    setLoading(prev => ({ ...prev, email: true }));
    const result = await validateEmail(formData.email);
    setValidations(prev => ({ ...prev, email: result }));
    setLoading(prev => ({ ...prev, email: false }));
  };

  const handleValidateMobile = async () => {
    if (!formData.mobile) return;
    
    setLoading(prev => ({ ...prev, mobile: true }));
    const result = await validateMobile(formData.mobile, formData.country);
    setValidations(prev => ({ ...prev, mobile: result }));
    setLoading(prev => ({ ...prev, mobile: false }));
  };

  const handleValidateTaxId = async () => {
    if (!formData.taxId) return;
    
    setLoading(prev => ({ ...prev, taxId: true }));
    const result = await validateTaxId(formData.taxId, taxIdType, formData.country);
    setValidations(prev => ({ ...prev, taxId: result }));
    setLoading(prev => ({ ...prev, taxId: false }));
  };

  const handleValidateGSTIN = async () => {
    if (!formData.gstin) return;
    
    setLoading(prev => ({ ...prev, gstin: true }));
    const result = await validateGSTIN(formData.gstin);
    setValidations(prev => ({ ...prev, gstin: result }));
    setLoading(prev => ({ ...prev, gstin: false }));
  };

  const handleValidateSpoc = async () => {
    if (!formData.uncodedSpocId) return;
    
    setLoading(prev => ({ ...prev, spoc: true }));
    try {
      const spocMappings = await AdminService.getAllSpocMappings();
      const spocMapping = spocMappings.find(mapping => mapping.spoc_id === formData.uncodedSpocId);
      
      if (spocMapping) {
        setSpocValidation({
          isValid: true,
          spocName: spocMapping.name,
          message: `SPOC verified: ${spocMapping.name}`
        });
      } else {
        setSpocValidation({
          isValid: false,
          spocName: '',
          message: 'SPOC ID not found. Please verify with your contact person.'
        });
      }
    } catch (error) {
      setSpocValidation({
        isValid: false,
        spocName: '',
        message: 'Unable to verify SPOC ID. Please try again.'
      });
    } finally {
      setLoading(prev => ({ ...prev, spoc: false }));
    }
  };

  // Auto-validate SPOC when ID changes
  useEffect(() => {
    if (formData.uncodedSpocId && formData.uncodedSpocId.length >= 3) {
      const timeoutId = setTimeout(() => {
        handleValidateSpoc();
      }, 500); // Debounce for 500ms
      
      return () => clearTimeout(timeoutId);
    } else {
      setSpocValidation({ isValid: false, spocName: '', message: '' });
    }
  }, [formData.uncodedSpocId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredValidations = [
      otpStates.email.verified, 
      otpStates.mobile.verified, 
      validations.taxId.isValid,
      spocValidation.isValid
    ];
    if (formData.country === 'India' && formData.gstin) {
      requiredValidations.push(validations.gstin.isValid);
    }
    
    if (!requiredValidations.every(Boolean)) {
      alert('Please complete all validations including email OTP, mobile OTP, tax ID, and SPOC ID verification before proceeding');
      return;
    }
    
    onNext({ ...formData, taxIdType });
  };

  const countries = ['India', 'USA', 'UAE', 'UK'];
  const brands = ['Apple', 'Samsung', 'Vivo', 'OnePlus', 'Xiaomi', 'Oppo'];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Company Details</h2>
          {authenticatedUser && (
            <div className="text-sm text-gray-600">
              Welcome, {authenticatedUser.firstName}!
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Owner and Firm Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Name *
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Firm Name *
              </label>
              <input
                type="text"
                value={formData.firmName}
                onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Contact Details with OTP Validation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email ID *
              </label>
              <div className="space-y-2">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                {!otpStates.email.sent ? (
                  <button
                    type="button"
                    onClick={handleSendEmailOTP}
                    disabled={!formData.email}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    Send OTP
                  </button>
                ) : !otpStates.email.verified ? (
                  <div className="space-y-2">
                    <p className="text-sm text-blue-600">OTP sent to your email</p>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={otpStates.email.otp}
                        onChange={(e) => setOtpStates(prev => ({ 
                          ...prev, 
                          email: { ...prev.email, otp: e.target.value.replace(/\D/g, '').slice(0, 6) } 
                        }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyEmailOTP}
                        disabled={otpStates.email.otp.length !== 6}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Email Verified</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <div className="space-y-2">
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="+91-9876543210"
                  required
                />
                {!otpStates.mobile.sent ? (
                  <button
                    type="button"
                    onClick={handleSendMobileOTP}
                    disabled={!formData.mobile}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    Send OTP
                  </button>
                ) : !otpStates.mobile.verified ? (
                  <div className="space-y-2">
                    <p className="text-sm text-blue-600">OTP sent to your mobile</p>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={otpStates.mobile.otp}
                        onChange={(e) => setOtpStates(prev => ({ 
                          ...prev, 
                          mobile: { ...prev.mobile, otp: e.target.value.replace(/\D/g, '').slice(0, 6) } 
                        }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyMobileOTP}
                        disabled={otpStates.mobile.otp.length !== 6}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Mobile Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <select
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Sales"
                    checked={formData.business === 'Sales'}
                    onChange={(e) => setFormData({ ...formData, business: e.target.value as 'Sales' | 'Exchange' })}
                    className="mr-2"
                  />
                  Sales
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Exchange"
                    checked={formData.business === 'Exchange'}
                    onChange={(e) => setFormData({ ...formData, business: e.target.value as 'Sales' | 'Exchange' })}
                    className="mr-2"
                  />
                  Exchange
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uncoded SPOC ID *
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.uncodedSpocId}
                    onChange={(e) => setFormData({ ...formData, uncodedSpocId: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter SPOC ID"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleValidateSpoc}
                    disabled={loading.spoc || !formData.uncodedSpocId}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading.spoc ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
                {spocValidation.message && (
                  <div className={`flex items-center text-sm ${
                    spocValidation.isValid ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {spocValidation.isValid ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <AlertCircle className="w-4 h-4 mr-1" />
                    )}
                    {spocValidation.message}
                  </div>
                )}
                {spocValidation.isValid && spocValidation.spocName && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <strong>SPOC Contact:</strong> {spocValidation.spocName}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Please verify this is the correct person you've been in contact with.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Address Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN/ZIP Code *
                </label>
                <input
                  type="text"
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landmark
                </label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Location Code *
              </label>
              <input
                type="text"
                value={formData.brandLocationCode}
                onChange={(e) => setFormData({ ...formData, brandLocationCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Brand location code refers to Apple store id, DMS code etc.
              </p>
            </div>
          </div>

          {/* Tax ID with Validation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {taxIdType} *
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={`Enter ${taxIdType}`}
                required
              />
              <button
                type="button"
                onClick={handleValidateTaxId}
                disabled={loading.taxId}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {loading.taxId ? 'Validating...' : 'Verify'}
              </button>
            </div>
            {validations.taxId.message && (
              <p className={`text-sm mt-1 ${validations.taxId.isValid ? 'text-green-600' : 'text-red-600'}`}>
                {validations.taxId.message}
              </p>
            )}
          </div>

          {/* GSTIN for India */}
          {formData.country === 'India' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GSTIN *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.gstin}
                disabled={!!authenticatedUser?.email}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  authenticatedUser?.email ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                  placeholder="Enter GSTIN"
                  required
                />
                {authenticatedUser?.email && (
                  <p className="text-xs text-gray-500 mt-1">
                    Using authenticated email address
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleValidateGSTIN}
                  disabled={!formData.email || !!authenticatedUser?.email}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {authenticatedUser?.email ? 'Email Pre-verified' : 'Send OTP'}
                </button>
              </div>
              {validations.gstin.message && (
                <p className={`text-sm mt-1 ${validations.gstin.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {validations.gstin.message}
                </p>
              )}
            </div>
          )}

          {/* Payment and Invoicing Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Modes *
              </label>
              <div className="space-y-2">
                {['Insta-pay', 'PAYG'].map(mode => (
                  <label key={mode} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.paymentModes.includes(mode)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, paymentModes: [...formData.paymentModes, mode] });
                        } else {
                          setFormData({ ...formData, paymentModes: formData.paymentModes.filter(m => m !== mode) });
                        }
                      }}
                      className="mr-2"
                    />
                    {mode}
                  </label>
                ))}
              </div>
              
              {/* PAYG Options */}
              {formData.paymentModes.includes('PAYG') && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAYG Type *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="single"
                        checked={formData.paymentModeDetails?.payg?.type === 'single'}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          paymentModeDetails: { 
                            ...formData.paymentModeDetails, 
                            payg: { type: 'single' } 
                          } 
                        })}
                        className="mr-2"
                      />
                      Single
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="multi-store"
                        checked={formData.paymentModeDetails?.payg?.type === 'multi-store'}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          paymentModeDetails: { 
                            ...formData.paymentModeDetails, 
                            payg: { type: 'multi-store' } 
                          } 
                        })}
                        className="mr-2"
                      />
                      Multi Store
                    </label>
                  </div>
                  
                  {formData.paymentModeDetails?.payg?.type === 'multi-store' && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Multi Store Email ID *
                      </label>
                      <input
                        type="email"
                        value={formData.paymentModeDetails?.payg?.multiStoreEmail || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          paymentModeDetails: { 
                            ...formData.paymentModeDetails, 
                            payg: { 
                              ...formData.paymentModeDetails?.payg, 
                              type: 'multi-store',
                              multiStoreEmail: e.target.value 
                            } 
                          } 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoicing Frequency *
              </label>
              <div className="space-y-2">
                {['daily', 'weekly', 'monthly'].map(freq => (
                  <label key={freq} className="flex items-center">
                    <input
                      type="radio"
                      value={freq}
                      checked={formData.invoicingFrequency === freq}
                      onChange={(e) => setFormData({ ...formData, invoicingFrequency: e.target.value as any })}
                      className="mr-2"
                    />
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </label>
                ))}
              </div>
              
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                Invoicing Type *
              </label>
              <div className="space-y-2">
                {['consolidated', 'statewise', 'storewise'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      value={type}
                      checked={formData.invoicingType === type}
                      onChange={(e) => setFormData({ ...formData, invoicingType: e.target.value as any })}
                      className="mr-2"
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Next: Banking Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyDetailsForm;