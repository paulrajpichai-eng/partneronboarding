import { ValidationResult } from '../types/partner';

export const validateMobile = async (mobile: string, country: string): Promise<ValidationResult> => {
  // Simulate OTP validation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mobileRegex = {
    'USA': /^\+1-\d{3}-\d{4}$/,
    'India': /^\+91-\d{10}$/,
    'UAE': /^\+971-\d{8,9}$/
  };
  
  const regex = mobileRegex[country as keyof typeof mobileRegex];
  if (!regex || !regex.test(mobile)) {
    return { isValid: false, message: 'Invalid mobile number format for selected country' };
  }
  
  return { isValid: true, message: 'Mobile number verified successfully' };
};

export const validateEmail = async (email: string): Promise<ValidationResult> => {
  // Simulate email OTP validation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Invalid email format' };
  }
  
  return { isValid: true, message: 'Email verified successfully' };
};

export const validateTaxId = async (taxId: string, taxIdType: string, country: string): Promise<ValidationResult> => {
  // Simulate real-time API validation
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const validationRules = {
    'PAN': /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    'GSTIN': /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    'TIN': /^\d{2}-\d{7}$/,
    'VAT': /^[A-Z]{2}\d{9}$/
  };
  
  const regex = validationRules[taxIdType as keyof typeof validationRules];
  if (!regex || !regex.test(taxId)) {
    return { isValid: false, message: `Invalid ${taxIdType} format` };
  }
  
  // Simulate API response
  const isValidInDatabase = Math.random() > 0.1; // 90% success rate
  if (!isValidInDatabase) {
    return { isValid: false, message: `${taxIdType} not found in government database` };
  }
  
  return { 
    isValid: true, 
    message: `${taxIdType} verified successfully`,
    data: { verified: true, registeredName: 'Sample Company Name' }
  };
};

export const validateGSTIN = async (gstin: string): Promise<ValidationResult> => {
  // Simulate GSTIN validation
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!gstinRegex.test(gstin)) {
    return { isValid: false, message: 'Invalid GSTIN format' };
  }
  
  // Simulate API response
  const isValidInDatabase = Math.random() > 0.1; // 90% success rate
  if (!isValidInDatabase) {
    return { isValid: false, message: 'GSTIN not found in government database' };
  }
  
  return { 
    isValid: true, 
    message: 'GSTIN verified successfully',
    data: { verified: true, registeredName: 'Sample Company Name' }
  };
};

export const getTaxIdType = (country: string): string => {
  const taxIdTypes = {
    'India': 'PAN',
    'USA': 'TIN',
    'UAE': 'VAT',
    'UK': 'VAT'
  };
  
  return taxIdTypes[country as keyof typeof taxIdTypes] || 'Tax ID';
};

export const generateUniqueId = (prefix: string): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}${timestamp}${random}`;
};

export const sendSpocNotification = async (spocId: string, partnerName: string, partnerDetails: any): Promise<void> => {
  // Simulate email sending to SPOC
  console.log(`Sending email to SPOC ${spocId} for partner: ${partnerName}`);
  console.log('Partner details:', partnerDetails);
  
  // In real implementation, this would trigger an email with brand channel selection options
  await new Promise(resolve => setTimeout(resolve, 1000));
};